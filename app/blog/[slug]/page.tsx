import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).map(f => ({ slug: f.replace('.md', '') }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);
  if (!fs.existsSync(filePath)) notFound();

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  return (
    <article style={{ maxWidth: '850px', margin: '0 auto', padding: '4rem 1.5rem', fontFamily: 'system-ui, sans-serif', color: '#1a1a1a', lineHeight: '1.7' }}>
      <nav style={{ marginBottom: '3rem' }}>
        <a href="/" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>&larr; BACK TO INDEX</a>
      </nav>

      {lines.map((line, i) => {
        // H1 Title
        if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '2rem', letterSpacing: '-0.03em', lineHeight: '1.1' }}>{line.replace('# ', '')}</h1>;
        // H2 Section
        if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '3.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>{line.replace('## ', '')}</h2>;
        // Pros / Cons Special Handling
        if (line.includes('PROS') || line.startsWith('▲')) return <div key={i} style={{ color: '#2e7d32', fontWeight: 'bold', marginTop: '1rem', display: 'flex', alignItems: 'center' }}><span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>▲</span> {line.replace(/^[▲\s*+-]+/, '')}</div>;
        if (line.includes('CONS') || line.startsWith('▼')) return <div key={i} style={{ color: '#d32f2f', fontWeight: 'bold', marginTop: '1rem', display: 'flex', alignItems: 'center' }}><span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>▼</span> {line.replace(/^[▼\s*+-]+/, '')}</div>;
        // Horizontal Rule
        if (line.startsWith('---')) return <hr key={i} style={{ border: 'none', borderTop: '1px solid #eee', margin: '3rem 0' }} />;
        // Standard Paragraph
        if (line.trim() === '') return <div key={i} style={{ height: '1rem' }} />;
        return <p key={i} style={{ marginBottom: '1.2rem', fontSize: '1.15rem', color: '#333' }}>{line}</p>;
      })}

      <aside style={{ marginTop: '5rem', padding: '2.5rem', backgroundColor: '#000', color: '#fff', borderRadius: '4px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AI INTELLIGENCE ALERT</h3>
        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>This analysis is updated daily based on the latest LLM benchmarks.</p>
        <button style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '1rem 2rem', fontWeight: 'bold', borderRadius: '2px', cursor: 'pointer' }}>SUBSCRIBE TO NEWSLETTER</button>
      </aside>
    </article>
  );
}
