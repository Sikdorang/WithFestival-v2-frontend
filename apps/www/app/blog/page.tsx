import Link from "next/link";
import { listPosts } from "@/src/lib/blog";

export const revalidate = 60;

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

export default async function BlogIndexPage() {
  const posts = await listPosts();

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
        <header className="flex flex-col gap-3">
          <h1 className="text-[34px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#292a2e] md:text-[44px]">
            Blog
          </h1>
          <p className="max-w-xl text-sm text-[#5f616a] md:text-base">
            축제랑이 보고, 듣고, 만든 이야기.
          </p>
        </header>

        <div className="mt-10">

        {posts.length === 0 ? (
          <p className="text-[15px] text-[#5f616a]">
            아직 발행된 글이 없습니다. <code className="rounded bg-[#f7f8fa] px-1.5 py-0.5 text-[13px]">content/blog/</code>{" "}
            폴더에 markdown 파일을 추가해주세요.
          </p>
        ) : (
          <ul className="flex flex-col">
            {posts.map((post, idx) => (
              <li
                key={post.slug}
                className={idx === 0 ? "" : "border-t border-[#36383e1a]"}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-2 py-7 transition-colors md:flex-row md:items-baseline md:justify-between md:gap-10 md:py-8"
                >
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center gap-3 text-xs font-medium text-[#92949d] md:text-sm">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      {post.tag && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-[#c8c9cd]" />
                          <span>{post.tag}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold tracking-[-0.01em] text-[#292a2e] transition-colors group-hover:text-[#5f616a] md:text-2xl">
                      {post.title}
                    </h2>
                    {post.summary && (
                      <p className="text-[15px] text-[#5f616a] md:text-base">
                        {post.summary}
                      </p>
                    )}
                  </div>
                  <span
                    aria-hidden
                    className="hidden text-base text-[#92949d] transition-colors group-hover:text-[#292a2e] md:inline"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>
    </main>
  );
}
