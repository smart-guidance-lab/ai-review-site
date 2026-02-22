import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).map(f => ({ slug: f.replace('.md', '') }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), 'content', 'posts', `${resolvedParams.slug}.md`);

  if (!fs.existsSync(filePath)) notFound();
  let content = fs.readFileSync(filePath, 'utf8');

  // URL抽出
  const urlMatch = content.match(/\[TARGET_URL:\s*(.*?)\]/);
  let targetUrl = urlMatch ? urlMatch[1].trim() : '';
  
  // 【絶対パスの強制】httpが含まれない場合は自分自身のトップページへ戻す（エラー回避）
  if (!targetUrl.startsWith('http')) {
    targetUrl = '/';
  }

  // タグを本文から除去
  content = content.replace(/\[TARGET_URL:.*?\]/g, '');

  return (
    <article style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', fontFamily: '"Georgia", serif', color: '#111', lineHeight: '1.8' }}>
      <nav style={{ marginBottom: '4rem' }}>
        <a href="/" style={{ textDecoration: 'none', color: '#0070f3', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>&larr; Back to Index</a>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {content.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '3.5rem', fontFamily: '"Times New Roman", serif', marginBottom: '2rem' }}>{line.replace('# ', '')}</h1>;
          if (line.startsWith('> ')) return <blockquote key={i} style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#555', borderLeft: '3px solid #000', paddingLeft: '1.5rem', margin: '2rem 0' }}>{line.replace('> ', '')}</blockquote>;
          if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem', marginTop: '3rem' }}>{line.replace('## ', '')}</h2>;
          return <p key={i} style={{ marginBottom: '1.5rem', fontSize: '1.15rem' }}>{line}</p>;
        })}
      </div>

      <footer style={{ marginTop: '8rem', padding: '3rem', border: '1px solid #000', textAlign: 'center' }}>
        <h3 style={{ fontFamily: '"Times New Roman", serif', fontSize: '1.5rem', marginBottom: '1rem' }}>The Intelligence Verdict</h3>
        <p style={{ fontSize: '1rem', color: '#666', marginBottom: '2rem' }}>Experience this intelligence transformation first-hand via the official link below.</p>
        <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#000', color: '#fff', padding: '1rem 2rem', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px' }}>EXPLORE OFFICIAL TOOL</a>
      </footer>
    </article>
  );
}
