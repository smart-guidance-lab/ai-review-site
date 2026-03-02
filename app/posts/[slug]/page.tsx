import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from "next/navigation";

// [要素] GitHubのユーザー名とリポジトリ名を最新の状態に設定
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/smart-guidance-lab/ai-review-site/main/content/posts";

export const revalidate = 600; // 10分ごとにキャッシュを更新
export const dynamicParams = true;

// メタデータの動的取得
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${GITHUB_RAW_BASE}/${slug}.md`, { next: { revalidate: 600 } });
    if (!res.ok) return { title: "Post Not Found" };
    const raw = await res.text();
    const { data } = matter(raw);
    return { title: `${data.title || slug} | AI Review` };
  } catch {
    return { title: "Error" };
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // [メカニズム] GitHubから直接マークダウンをHTTP経由で取得する
  // これにより、Vercelのビルド時ディスク制限を完全に回避する
  const response = await fetch(`${GITHUB_RAW_BASE}/${slug}.md`, { 
    next: { revalidate: 600 } 
  });
  
  if (!response.ok) {
    console.error(`Failed to fetch: ${slug}.md`);
    notFound();
  }

  const raw = await response.text();
  const { content } = matter(raw);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="border-b border-stone-200 bg-white/80 dark:border-stone-800 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            ← Back to home
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="prose prose-stone dark:prose-invert prose-headings:font-semibold prose-a:text-amber-600 dark:prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
