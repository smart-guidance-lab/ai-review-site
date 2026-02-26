import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function Home() {
  const postsDir = path.join(process.cwd(), 'content/posts');
  let posts: any[] = [];
  
  if (fs.existsSync(postsDir)) {
    posts = fs.readdirSync(postsDir)
      .filter(f => f.endsWith('.md'))
      .map(file => {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const title = content.match(/# (.*)/)?.[1] || "Untitled Report";
        const summary = content.match(/> (.*)/)?.[1] || "";
        const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return { slug: file.replace('.md', ''), title, summary, hash, mtime: fs.statSync(path.join(postsDir, file)).mtimeMs };
      })
      .sort((a, b) => b.mtime - a.mtime);
  }

  return (
    <main style={{ backgroundColor: '#fff', color: '#000', minHeight: '100vh', fontFamily: '"Times New Roman", serif' }}>
      {/* 巨大ヘッダー：権威の象徴 */}
      <header style={{ padding: '8rem 2rem', borderBottom: '5px solid #000', textAlign: 'center', backgroundColor: '#000', color: '#fff' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 15vw, 8rem)', margin: 0, letterSpacing: '-6px', lineHeight: 0.8 }}>AI INSIGHT GLOBAL</h1>
        <p style={{ fontSize: '1.2rem', marginTop: '2rem', letterSpacing: '8px', opacity: 0.5, textTransform: 'uppercase' }}>Autonomous Intelligence Monitoring Bureau</p>
      </header>

      {/* ニュースグリッド：3カラムの物量攻め */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '2px',
        backgroundColor: '#000', // グリッド線
        borderBottom: '2px solid #000'
      }}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article style={{
              backgroundColor: '#fff',
              padding: '3rem 2rem',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'background 0.3s'
            }} className="post-card">
              <span style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '3px' }}>REPORT 0x{post.hash.toString(16).toUpperCase()}</span>
              <h2 style={{ fontSize: '2.2rem', margin: '1.5rem 0', lineHeight: 1.1, fontWeight: 'normal' }}>{post.title}</h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#444', flexGrow: 1, textAlign: 'justify' }}>{post.summary.slice(0, 120)}...</p>
              <div style={{ marginTop: '2rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', borderTop: '1px solid #eee', paddingTop: '1rem' }}>Examine Analysis &rarr;</div>
            </article>
          </Link>
        ))}
      </div>

      <footer style={{ padding: '5rem 2rem', textAlign: 'center', fontSize: '0.9rem', letterSpacing: '2px', color: '#999' }}>
        &copy; 2026 AI INSIGHT GLOBAL. ALGORITHMIC INTEGRITY.
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .post-card:hover { background: #f5f5f5 !important; }
        @media (max-width: 768px) { h1 { letter-spacing: -2px !important; } }
      `}} />
    </main>
  );
}
