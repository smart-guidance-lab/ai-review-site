import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

// 全ての記事パスをビルド時に生成する（SEOと高速化に必須）
export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  return files.map((file) => ({
    slug: file.replace('.md', ''),
  }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const content = fs.readFileSync(filePath, 'utf8');

  return (
    <article style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <a href="/" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Back to Global Insights</a>
      </nav>
      
      <div style={{ borderLeft: '8px solid #000', paddingLeft: '1.5rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#888', margin: 0 }}>Exclusive Report | AI Insight Global</p>
      </div>

      <div style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', color: '#333' }}>
        {/* Markdownの簡易レンダリング：#をタイトルとして強調 */}
        {content.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>{line.replace('# ', '')}</h1>;
          if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '2.5rem', borderBottom: '2px solid #eee' }}>{line.replace('## ', '')}</h2>;
          return <p key={i}>{line}</p>;
        })}
      </div>

      <footer style={{ marginTop: '5rem', padding: '2rem', backgroundColor: '#f0f7ff', borderRadius: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Join the AI Intelligence Network</h3>
        <p style={{ fontSize: '0.9rem', color: '#555' }}>Get daily updates on the world's most powerful AI transformations.</p>
        <button style={{ background: '#0070f3', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Subscribe for Free</button>
      </footer>
    </article>
  );
}
