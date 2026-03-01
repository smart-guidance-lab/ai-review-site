import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from "next/navigation";

// [要素] GitHubのユーザー名とリポジトリ名を設定
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/smart-guidance-lab/ai-review-site/main/content/posts";

export const revalidate = 600; // 10分ごとにキャッシュを更新
export const dynamicParams = true;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // [メカニズム] GitHubから直接マークダウンを取得する
  const response = await fetch(`${GITHUB_RAW_BASE}/${slug}.md`, { next: { revalidate: 600 } });
  
  if (!response.ok) notFound();

  const raw = await response.text();
  const { content } = matter(raw);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="border-b border-stone-200 bg-white/80 sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 py-4"><Link href="/" className="text-sm">← Back</Link></div>
      </header>
      <article className="mx-auto max-w-3xl px-4 py-10">
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
