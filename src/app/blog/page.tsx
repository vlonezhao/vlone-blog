import Link from "next/link";
import { getAllPosts } from "@/lib/post";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">文章列表</h1>
      <ul className="mt-8 space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="border-b pb-4">
            <Link
              href={`/blog/${post.slug}`}
              className="text-xl font-semibold hover:underline"
            >
              {post.frontmatter.title}
            </Link>
            <div className="mt-1 text-sm text-gray-500">
              {post.frontmatter.date}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
