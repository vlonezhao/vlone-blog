import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostSlugs, getPostBySlug } from "@/lib/post";

type Props = { params: { id: string } };

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

// 小工具：格式化日期为 “2025年8月25日”
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;   // ✅ 先 await
  const post = await getPostBySlug(id);

  if (!post) return notFound();

  const { title, date, tags } = post.frontmatter;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      {/* 返回列表 */}
      <div className="mb-6">
        <Link href="/blog" className="text-sm text-gray-500 hover:underline">
          ← 返回文章列表
        </Link>
      </div>

      {/* 标题 + 日期 + 标签 */}
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <div className="mt-2 text-sm text-gray-500">{formatDate(date)}</div>
      {tags?.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li
              key={t}
              className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-600"
            >
              #{t}
            </li>
          ))}
        </ul>
      ) : null}

      <article className="prose dark:prose-invert mx-auto mt-6">
        {post.mdx}
      </article>


    </main>
  );
}
