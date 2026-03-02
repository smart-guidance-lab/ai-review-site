import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from "next/navigation";

const REPO_URL = "https://raw.githubusercontent.com/smart-guidance-lab/ai-review-site/main/content/posts";

export const revalidate = 300; 
export const dynamicParams = true;

// Stripe決済リンクの定数化
const PRICING = {
  ENTRY: "https://buy.stripe.com/6oUcN41D9ggo0a4efg8so03",
  CORE: "https://buy.stripe.com/3cI00i95Bfck2ic7QS8so04",
  ULTIMATE: "https://buy.stripe.com/6oU14m95B5BK8GA5IK8so05"
};

export async function generateStaticParams() { return []; }

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${REPO_URL}/${slug}.md`, { cache: 'no-store' });
    if (!res.ok) return notFound();
    
    const raw = await res.text();
    const { content, data } = matter(raw);
    const title = data.title || content.match(/# (.*)/)?.[1] || "Intelligence Report";

    return (
      <article style={{ maxWidth: '850px', margin: '0 auto', padding: '4rem 1.5rem', backgroundColor: '#fff', color: '#111' }}>
        <header style={{ borderBottom: '2px solid #111', paddingBottom: '2rem', marginBottom: '3rem' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#666', fontSize: '0.9rem' }}>← SYSTEM_BACK</Link>
          <h1 style={{ fontSize: '2.5rem', marginTop: '1rem', fontWeight: '900', lineHeight: '1.1' }}>{title}</h1>
        </header>

        <section style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '5rem' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.replace(/# .*/, '').trim()}</ReactMarkdown>
        </section>

        {/* 決済ティア：最大収益化の心臓部 */}
        <div style={{ background: '#111', color: '#fff', padding: '3rem 2rem', textAlign: 'center', borderRadius: '4px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '2.5rem', letterSpacing: '2px' }}>STRATEGIC ACCESS TIER</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ border: '1px solid #444', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#aaa' }}>ENTRY</h3>
              <p style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>$47</p>
              <a href={PRICING.ENTRY} style={{ display: 'block', background: '#fff', color: '#000', padding: '0.8rem', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>ACQUIRE</a>
            </div>

            <div style={{ border: '2px solid #00ff41', padding: '1.5rem', position: 'relative' }}>
              <span style={{ background: '#00ff41', color: '#000', fontSize: '0.6rem', padding: '2px 8px', position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold' }}>RECOMMENDED</span>
              <h3 style={{ fontSize: '0.9rem', color: '#00ff41' }}>CORE</h3>
              <p style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>$297</p>
              <a href={PRICING.CORE} style={{ display: 'block', background: '#00ff41', color: '#000', padding: '0.8rem', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>SUBSCRIBE</a>
            </div>

            <div style={{ border: '1px solid #444', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#aaa' }}>ULTIMATE</h3>
              <p style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>$980</p>
              <a href={PRICING.ULTIMATE} style={{ display: 'block', background: '#fff', color: '#000', padding: '0.8rem', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>INVEST</a>
            </div>

          </div>
        </div>
      </article>
    );
  } catch (e) { return notFound(); }
}
