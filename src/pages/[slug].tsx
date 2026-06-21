import Detail from "@containers/Detail"
import { filterPosts } from "@/src/libs/utils/notion"
import Layout from "@components/Layout"
import CONFIG from "@/site.config"
import { NextPageWithLayout } from "@pages/_app"
import { TPost } from "../types"
import CustomError from "@containers/CustomError"
import { getPostBlocks, getPosts } from "@libs/apis"
import { useRouter } from "next/router"

export async function getStaticPaths() {
  const posts = await getPosts()
  const filteredPost = filterPosts(posts, {
    acceptStatus: ["Public", "PublicOnDetail"],
    acceptType: ["Paper", "Post", "Page"],
  })

  return {
    paths: filteredPost.map((row) => `/${row.slug}`),
    fallback: true,
  }
}

export async function getStaticProps({ params: { slug } }: any) {
  try {
    const posts = await getPosts()
    const post = posts.find((t) => t.slug === slug)
    if (!post) return { props: {}, revalidate: 60 }
    const blockMap = await getPostBlocks(post.id)

    return {
      props: { post, blockMap },
      revalidate: 60,
    }
  } catch {
    return { props: {}, revalidate: 60 }
  }
}

type Props = {
  post: TPost
  blockMap: any
}

const DetailPage: NextPageWithLayout<Props> = ({ post, blockMap }) => {
  const router = useRouter()
  if (router.isFallback) return <PostSkeleton />
  if (!post) return <CustomError />
  return <Detail blockMap={blockMap} data={post} />
}

function PostSkeleton({ title }: { title?: string }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {title ? (
        <h1 className="font-bold text-3xl text-black dark:text-white mb-6">{title}</h1>
      ) : (
        <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-6 animate-pulse" />
      )}
      <div className="flex gap-3 mb-8 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-24" />
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-32" />
      </div>
      <div className="space-y-3 animate-pulse">
        {[90, 95, 80, 92, 70, 88, 65].map((w, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-zinc-700 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
}

DetailPage.getLayout = function getlayout(page) {
  const getImage = () => {
    if (page.props?.post?.thumbnail) return page.props.post.thumbnail
    if (CONFIG.ogImageGenerateURL)
      return `${CONFIG.ogImageGenerateURL}/${encodeURIComponent(
        page.props?.post?.title || ""
      )}.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fmorethan-log.vercel.app%2Flogo-for-dark-bg.svg`
  }

  const getMetaConfig = () => {
    if (!page.props?.post) {
      return {
        title: CONFIG.blog.title,
        description: CONFIG.blog.description,
        type: "website",
        url: CONFIG.link,
      }
    }
    return {
      title: page.props.post.title || CONFIG.blog.title,
      date: new Date(
        page.props.post.date?.start_date || page.props.post.createdTime || ""
      ).toISOString(),
      image: getImage(),
      description: page.props.post.summary,
      type: page.props.post.type[0],
      url: `${CONFIG.link}/${page.props.post.slug}`,
    }
  }
  return (
    <Layout metaConfig={getMetaConfig()} fullWidth={page.props.post?.fullWidth}>
      {page}
    </Layout>
  )
}

export default DetailPage
