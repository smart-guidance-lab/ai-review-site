import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from "next/navigation";

// [要素] GitHubリポジトリのRawデータURL
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/smart-guidance-lab/ai-review-site/main/content/posts";

export const revalidate = 600; // 10分ごとにキャッシュを更新（ISR）
export const dynamicParams = true;

// 静的パス生成を空にすることで、すべてのリクエストをオンデマンド（動的）で処理
export async function generateStaticParams() {
  return [];
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    // [メカニズム] GitHubから直接マークダウンを取得する
    const res = await fetch(`${GITHUB_RAW_BASE}/${slug}.md`, { 
      next: { revalidate: 600 },
      cache: 'no-store' // 開発・初期確認時はキャッシュを無視
    });
    
    if (!res.ok) return notFound();

    const raw = await res.text();
    const { content, data } = matter(raw);

    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <header className="border-b border-stone-200 bg-white/80 dark:border-stone-800 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
            <Link href="/" className="text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
              ← Back to home
            </Link>
          </div>
        </header>
        <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-bold mb-8 text-stone-900 dark:text-stone-100">
            {data.title || slug.replace(/-/g, ' ')}
          </h1>
          <div className="prose prose-stone dark:prose-invert max-w-none prose-a:text-amber-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </article>
      </div>
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return notFound();
  }
}
