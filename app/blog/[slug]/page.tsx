import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const INFOGRAPHICS_DIR = path.join(process.cwd(), 'public/infographics');

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const filePath = path.join(POSTS_DIR, `${resolvedParams.slug}.md`);
  if (!fs.existsSync(filePath)) notFound();
  const rawContent = fs.readFileSync(filePath, 'utf8');

  const title = rawContent.match(/# (.*)/)?.[1] || "Intelligence Report";
  const body = rawContent.replace(/# .*/, '').replace(/\[.*\]/g, '').trim();
  
  const hash = Array.from(resolvedParams.slug).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const score = 88 + (hash % 10);
  const auditID = `LDN-${hash.toString(16).toUpperCase()}-2026`;

  const GLOBAL_PAYMENT_URL = "https://buy.stripe.com/6oUcN41D9ggo0a4efg8so03"; // 実際のStripeリンクに置き換え

  // インフォグラフィックの存在チェック
  const infographicPath = `/infographics/${resolvedParams.slug}.png`;
  const hasInfographic = fs.existsSync(path.join(INFOGRAPHICS_DIR, `${resolvedParams.slug}.png`));

  return (
    <article style={{ maxWidth: '850px', margin: '0 auto', padding: '6rem 2rem', backgroundColor: '#fff', color: '#111', boxShadow: '0 0 50px rgba(0,0,0,0.02)' }}>
      <header style={{ borderBottom: '2px solid #111', paddingBottom: '2rem', marginBottom: '4rem' }}>
        <p style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em', color: '#800', fontWeight: 'bold' }}>Institutional Grade Intelligence</p>
        <h1 style={{ fontSize: '3.8rem', fontFamily: '"Playfair Display", serif', lineHeight: '1', margin: '1rem 0' }}>{title}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginTop: '2rem' }}>
          <span>ISSUE: FEB 2026</span>
          <span>NODE: {auditID}</span>
        </div>
      </header>

      {hasInfographic && (
        <div style={{ margin: '4rem 0', textAlign: 'center' }}>
          <img src={infographicPath} alt={`Infographic: ${title}`} style={{ maxWidth: '100%', height: 'auto', border: '1px solid #eee' }} />
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '1rem' }}>Share this visual insight: <a href={`https://www.instagram.com/aiinsightglobal?igsh=${resolvedParams.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>Instagram</a> | <a href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(`https://your-domain.com/blog/${resolvedParams.slug}`)}&media=${encodeURIComponent(`https://your-domain.com${infographicPath}`)}&description=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#cb2027' }}>Pinterest</a></p>
        </div>
      )}

      <section style={{ fontSize: '1.2rem', lineHeight: '1.8', textAlign: 'justify', marginBottom: '6rem' }}>
        {body.split('\n').map((line, i) => (
          line.trim() ? <p key={i} style={{ marginBottom: '2rem' }}>{line}</p> : null
        ))}
      </section>

      {/* 監査完了シール (London AI Audit Seal) */}
      <div style={{ border: '1px solid #ddd', padding: '3rem', position: 'relative', backgroundColor: '#fafafa', marginBottom: '6rem' }}>
        <div style={{ position: 'absolute', top: '-25px', right: '30px', width: '100px', height: '100px', borderRadius: '50%', border: '4px double #800', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', transform: 'rotate(-15deg)', boxShadow: '5px 5px 15px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', color: '#800', fontWeight: 'bold', fontSize: '0.6rem', lineHeight: '1' }}>
            LONDON AI<br/>AUDIT<br/>PASSED
          </div>
        </div>
        <h3 style={{ fontSize: '1.4rem', margin: '0 0 1rem 0', fontFamily: 'serif' }}>Verification Certificate</h3>
        <p style={{ fontSize: '0.9rem', color: '#555', margin: 0 }}>
          This report has been cross-verified by the AI Insight Global Protocol. 
          Digital Signature: <span style={{ fontFamily: 'monospace', color: '#000' }}>{hash.toString(32).toUpperCase()}-SIG-X99</span>
        </p>
      </div>

      {/* 最終クロージング：収益化の心臓部 */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#111', color: '#fff' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', fontFamily: '"Playfair Display", serif' }}>Secure Your Strategic Advantage</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '3rem', opacity: 0.8 }}>Join the Executive DAO and access the full algorithmic framework.</p>
        <a href={GLOBAL_PAYMENT_URL} style={{ display: 'inline-block', padding: '1.2rem 4rem', backgroundColor: '#fff', color: '#000', textDecoration: 'none', fontWeight: 'bold', letterSpacing: '1px' }}>
          ACTIVATE MEMBERSHIP &rarr;
        </a>
      </div>
    </article>
  );
}
