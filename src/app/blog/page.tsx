// src/app/blog/page.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/post";

export const metadata = {
  title: "博客",
  description: "文章列表",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">文章列表</h1>
      <ul className="mt-8 space-y-6">
        {posts.map(({ slug, frontmatter }) => (
          <li key={slug} className="border-b pb-4">
            <Link href={`/blog/${slug}`} className="text-xl font-semibold hover:underline">
              {frontmatter.title}
            </Link>
            <div className="mt-1 text-sm text-gray-500">
              {new Date(frontmatter.date).toLocaleDateString()}
              {frontmatter.tags?.length ? (
                <span> · {frontmatter.tags.join(" / ")}</span>
              ) : null}
            </div>
            {frontmatter.excerpt ? (
              <p className="mt-2 text-gray-700">{frontmatter.excerpt}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
