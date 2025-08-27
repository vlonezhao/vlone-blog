// src/lib/posts.ts
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

const CONTENT_DIR = path.join(process.cwd(), "src/content");

export type PostFrontmatter = {
  title: string;
  date: string;       // ISO 日期字符串
  tags?: string[];
  excerpt?: string;
};

export type PostMeta = {
  slug: string;
  frontmatter: PostFrontmatter;
};

export type PostDetail = PostMeta & {
  mdx: React.ReactNode; // 可直接渲染的 React 节点
};

/**
 * 获取所有文章 slug（文件名去掉 .mdx）
 */
export async function getPostSlugs(): Promise<string[]> {
  const files = await fs.readdir(CONTENT_DIR);
  return files.filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
}

/**
 * 获取文章的 metadata（不含内容）
 */
export async function getPostMeta(slug: string): Promise<PostMeta> {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const file = await fs.readFile(fullPath, "utf-8");
  const { data } = matter(file);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
  };
}

/**
 * 获取所有文章 metadata（列表页用）
 */
export async function getAllPosts(): Promise<PostMeta[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map(getPostMeta));
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

/**
 * 获取单篇文章详情（含 mdx 内容）
 */
export async function getPostBySlug(slug: string): Promise<PostDetail> {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const file = await fs.readFile(fullPath, "utf-8");
  const { content, data } = matter(file);

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
    components: {},
  });

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    mdx,
  };
}
