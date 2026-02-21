import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

// 全ての記事パスをビルド時に確定させる（SEO・高速化の核）
export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  return files.map((file) => ({
    slug: file.replace('.md', ''),
  }));
}

// 記事詳細ページのメインコンポーネント
export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // paramsを確実に取得
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // 正しいデータ保存先（content/posts）を指定
  const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    notFound();
  }

  const content = fs.readFileSync(filePath, 'utf8');

  return (
    <article style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <a href="/" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Back to Home</a>
      </nav>
      
      <header style={{ marginBottom: '3rem', borderLeft: '8px solid #0070f3', paddingLeft: '1.5rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>AI INSIGHT GLOBAL | EXCLUSIVE REPORT</p>
      </header>

      <div style={{ whiteSpace: 'pre-wrap', fontSize: '1.15rem', color: '#1a1a1a' }}>
        {content.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.2' }}>{line.replace('# ', '')}</h1>;
          if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '2.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>{line.replace('## ', '')}</h2>;
          return <p key={i} style={{ marginBottom: '1.2rem' }}>{line}</p>;
        })}
      </div>

      <footer style={{ marginTop: '5rem', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Stay Ahead of the AI Curve</h3>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>New intelligence reports published daily.</p>
        <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#999' }}>
          [AD] Unlock Premium AI Strategy Kits &rarr;
        </div>
      </footer>
    </article>
  );
}
