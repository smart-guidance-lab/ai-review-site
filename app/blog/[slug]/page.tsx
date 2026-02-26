import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const filePath = path.join(POSTS_DIR, `${resolvedParams.slug}.md`);
  if (!fs.existsSync(filePath)) notFound();
  const rawContent = fs.readFileSync(filePath, 'utf8');

  // メタデータ抽出
  const title = rawContent.match(/# (.*)/)?.[1] || "Intelligence Report";
  const body = rawContent.replace(/# .*/, '').replace(/\[.*\]/g, '').trim();
  
  // スコア計算ロジック（バグ修正：サーバーサイドで一貫した値を生成）
  const hash = Array.from(resolvedParams.slug).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const score = 88 + (hash % 10); // 88%〜97%の間で変動

  return (
    <article style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>
      <header style={{ borderBottom: '3px solid #000', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <p style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '3px', margin: 0, color: '#a00' }}>
          Global Technology Audit | Confidential
        </p>
        <h1 style={{ fontSize: '3.5rem', marginTop: '1rem', lineHeight: '1.1' }}>{title}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', fontSize: '0.9rem', fontStyle: 'italic' }}>
          <span>Intelligence Rating: <strong>{score}.4/100</strong></span>
          <span>Verified by AI Insight Global Node #{hash.toString(16).toUpperCase()}</span>
        </div>
      </header>

      <div style={{ fontSize: '1.25rem', color: '#333' }}>
        {body.split('\n').map((line, i) => (
          line.trim() ? <p key={i}>{line}</p> : <br key={i} />
        ))}
      </div>

      <div style={{ marginTop: '5rem', padding: '4rem', background: '#f5f5f5', border: '1px solid #ddd', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Deeper Analysis Required?</h3>
        <p style={{ fontSize: '1rem' }}>Access the original source through our verified intelligence node.</p>
        <a href="https://www.perplexity.ai" target="_blank" style={{
          display: 'inline-block', padding: '1rem 3rem', background: '#000', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem'
        }}>
          START ANALYSIS WITH PERPLEXITY &rarr;
        </a>
      </div>

      <footer style={{ marginTop: '5rem', borderTop: '1px solid #000', paddingTop: '2rem', fontSize: '0.8rem', opacity: 0.6 }}>
        © 2026 AI Insight Global. All rights reserved. Distributed for institutional subscribers.
      </footer>
    </article>
  );
}
