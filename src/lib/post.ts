// src/lib/posts.ts
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type PostFrontmatter = {
  title: string;
  date: string;       // ISO 日期字符串
  tags?: string[];
  excerpt?: string;
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string; // 原始 mdx（可选）
};

export async function getPostSlugs(): Promise<string[]> {
  const files = await fs.readdir(CONTENT_DIR);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const file = await fs.readFile(fullPath, "utf-8");

  const { content, data } = matter(file);
  const frontmatter = data as PostFrontmatter;

  // 用 RSC 方式编译 MDX -> React 组件
  const { content: mdx } = await compileMDX<PostFrontmatter>({
    source: content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
      },
    },
    // 以后可以在这里放自定义 MDX 组件映射
    components: {},
  });

  return {
    slug,
    frontmatter,
    mdx, // 这是可直接在 React Server Component 里渲染的内容
  };
}

export async function getAllPosts() {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map((s) => getPostMeta(s)));
  // 按日期倒序
  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

async function getPostMeta(slug: string) {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const file = await fs.readFile(fullPath, "utf-8");
  const { data } = matter(file);
  return {
    slug,
    frontmatter: data as PostFrontmatter,
  };
}

export type Post = {
  id: string
  title: string
  date: string
  content?: string
}

// 如果你已有 getPosts()，确保它返回的每篇文章有个可选的 content 字段（今天用于详情页展示）
export function getPosts(): Post[] {
  return [
    { id: '1', title: '我的第一篇文章', date: '2025-08-24', content: '这是第一篇文章的正文内容。' },
    { id: '2', title: '使用 Next.js 搭建博客', date: '2025-08-25', content: '这是第二篇文章的正文内容。' },
  ]
}

// ✅ 新增：按 id 获取单篇
export function getPostById(id: string): Post | undefined {
  return getPosts().find(p => p.id === id)
}

// ✅ 新增：用于 SSG 生成静态路径
export function getAllIds(): string[] {
  return getPosts().map(p => p.id)
}