import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  return files.map((file) => ({ slug: file.replace('.md', '') }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);

  if (!fs.existsSync(filePath)) notFound();

  // 太字記号 (**) を一括除去してクリーンにする
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const content = rawContent.replace(/\*\*/g, '');

  return (
    <article style={{ padding: '4rem 1.5rem', maxWidth: '750px', margin: '0 auto', color: '#1a1a1a', backgroundColor: '#fff', minHeight: '100vh', lineHeight: '1.8' }}>
      <nav style={{ marginBottom: '3rem' }}>
        <a href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px' }}>&larr; BACK TO INDEX</a>
      </nav>

      <div style={{ fontSize: '1.1rem' }}>
        {content.split('\n').map((line, i) => {
          // メインタイトル
          if (line.startsWith('# ')) {
            return <h1 key={i} style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '3rem', letterSpacing: '-1.5px', lineHeight: '1.1', borderBottom: '8px solid #000', paddingBottom: '1rem' }}>{line.replace('# ', '')}</h1>;
          }
          // セクション見出し（Advantages/Drawbacks等）
          if (line.startsWith('## ')) {
            const title = line.replace('## ', '');
            const isPositive = title.toLowerCase().includes('advantage');
            const isNegative = title.toLowerCase().includes('drawback');
            return (
              <h2 key={i} style={{ 
                fontSize: '1.6rem', fontWeight: '800', marginTop: '3.5rem', marginBottom: '1.5rem',
                color: isPositive ? '#0070f3' : isNegative ? '#e00' : '#000',
                borderLeft: `4px solid ${isPositive ? '#0070f3' : isNegative ? '#e00' : '#000'}`,
                paddingLeft: '1rem'
              }}>
                {title}
              </h2>
            );
          }
          // 本文
          return line.trim() ? <p key={i} style={{ marginBottom: '1.5rem' }}>{line}</p> : <div key={i} style={{ height: '1rem' }} />;
        })}
      </div>

      <footer style={{ marginTop: '8rem', borderTop: '1px solid #eee', paddingTop: '3rem', textAlign: 'center' }}>
        <p style={{ color: '#999', fontSize: '0.8rem', letterSpacing: '2px' }}>&copy; 2026 AI INSIGHT GLOBAL. ALL RIGHTS RESERVED.</p>
      </footer>
    </article>
  );
}
