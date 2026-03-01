import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from "next/navigation";

// [要素] ISRの設定：1時間ごとにページをバックグラウンドで再生成
export const revalidate = 3600; 
// [要素] 動的パラメータの許可：ビルド時に存在しなかった記事もオンデマンドで生成する
export const dynamicParams = true; 

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

// 以下、ロジック部分は維持しつつ堅牢化
export async function generateStaticParams() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const slugs = fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(POSTS_DIR, `${slug}.md`);

  // ファイルが存在しない場合は即座に 404
  if (!fs.existsSync(filePath)) notFound();

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);

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
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
