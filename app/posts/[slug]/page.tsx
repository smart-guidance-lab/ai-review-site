import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from "next/navigation";

const REPO_URL = "https://raw.githubusercontent.com/smart-guidance-lab/ai-review-site/main/content/posts";

export const revalidate = 300; // 5分キャッシュ
export const dynamicParams = true;

export async function generateStaticParams() { return []; }

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${REPO_URL}/${slug}.md`, { cache: 'no-store' });
    if (!res.ok) return notFound();
    const { content, data } = matter(await res.text());
    return (
      <div className="min-h-screen bg-white dark:bg-black p-8">
        <Link href="/" className="text-amber-600">← Back</Link>
        <article className="max-w-2xl mx-auto prose dark:prose-invert mt-10">
          <h1>{data.title || slug}</h1>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </div>
    );
  } catch (e) { return notFound(); }
}
