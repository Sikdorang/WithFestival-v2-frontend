import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, listPosts } from "@/src/lib/blog";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

function formatDate(date: string) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-white pt-28 pb-24 md:pt-32 md:pb-32">
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5f616a] transition-colors hover:text-[#292a2e]"
        >
          ← Blog
        </Link>

        <header className="mt-10 md:mt-14">
          <div className="flex items-center gap-3 text-xs font-medium text-[#92949d] md:text-sm">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.tag && (
              <>
                <span className="h-1 w-1 rounded-full bg-[#c8c9cd]" />
                <span>{post.tag}</span>
              </>
            )}
            {post.author && (
              <>
                <span className="h-1 w-1 rounded-full bg-[#c8c9cd]" />
                <span>{post.author}</span>
              </>
            )}
          </div>
          <h1 className="mt-4 text-[36px] font-semibold tracking-[-0.01em] leading-[1.25] text-[#292a2e] md:text-[52px]">
            {post.title}
          </h1>
          {post.summary && (
            <p className="mt-5 text-[16px] text-[#5f616a] md:text-[18px]">
              {post.summary}
            </p>
          )}
        </header>

        {post.cover && (
          <div className="mt-10 overflow-hidden rounded-[20px] md:mt-14 md:rounded-[28px]">
            <img
              src={post.cover}
              alt=""
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <article
          className="prose mt-12 md:mt-16"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    </main>
  );
}
