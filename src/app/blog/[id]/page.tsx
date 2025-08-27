import { notFound } from "next/navigation";
import { getPostSlugs, getPostBySlug } from "@/lib/post";

type Props = { params: { id: string } };

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.id);

  if (!post) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">{post.frontmatter.title}</h1>
      <div className="mt-2 text-sm text-gray-500">{post.frontmatter.date}</div>

      <article className="mt-6 leading-7 text-gray-800 prose">
        {post.mdx}
      </article>
    </main>
  );
}
