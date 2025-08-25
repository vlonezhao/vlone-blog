import { notFound } from "next/navigation"
import { getAllIds, getPostById } from "@/lib/post"

type Props = { params: { id: string } }

// 让每篇文章在构建时静态生成（SEO更好、加载更快）
export async function generateStaticParams() {
  const ids = getAllIds()
  return ids.map(id => ({ id }))
}

// 可选：为详情页设置动态标题
export async function generateMetadata({ params }: Props) {
  const post = getPostById(params.id)
  return {
    title: post ? `${post.title} - 我的博客` : "文章不存在",
    description: post?.content?.slice(0, 80),
  }
}

export default async function PostPage({ params }: Props) {
  const post = getPostById(params.id)
  if (!post) return notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="mt-2 text-sm text-gray-500">{post.date}</div>

      <article className="mt-6 leading-7 text-gray-800 whitespace-pre-wrap">
        {post.content ?? "（这篇文章暂时没有正文内容）"}
      </article>
    </main>
  )
}
