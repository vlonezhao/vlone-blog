import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.mdx?$/
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'], // 让 Next.js 识别 mdx 文件
}

export default withMDX(nextConfig)
