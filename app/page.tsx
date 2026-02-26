import fs from 'fs';
import path from 'path';
import Link from 'next/link';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  
  return files.map(filename => {
    const filePath = path.join(POSTS_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const slug = filename.replace('.md', '');
    const title = content.match(/# (.*)/)?.[1] || "Untitled Analysis";
    const summary = content.match(/Summary:\s*(.*)/i)?.[1].slice(0, 100) + '...' || "Full report available.";
    const stats = fs.statSync(filePath);
    
    // 視覚的個性を生むためのハッシュ
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;

    return { slug, title, summary, date: stats.mtime, hue, hash };
  }).sort((a, b) => b.date.getTime() - a.date.getTime());
}

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <main style={{ backgroundColor: '#fff', color: '#000', minHeight: '100vh', fontFamily: '"Times New Roman", serif' }}>
      
      {/* 権威的ヘッダー */}
      <header style={{ padding: '4rem 2.5rem', borderBottom: '1px solid #000', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 12vw, 8rem)', fontWeight: 'normal', letterSpacing: '-6px', margin: 0, lineHeight: 0.8 }}>AI INSIGHT GLOBAL</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '4px', fontWeight: 'bold' }}>
          <span>Volume: {posts.length} Reports</span>
          <span>Update: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: '2026' })}</span>
          <span>Status: Autonomous</span>
        </div>
      </header>

      {/* グリッド・マトリクス */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '1px', 
        backgroundColor: '#000', // グリッド線を黒で表現
        borderBottom: '1px solid #000'
      }}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article style={{ 
              backgroundColor: '#fff', 
              padding: '2.5rem', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'background-color 0.3s'
            }} className="post-card">
              <div style={{ 
                width: '100%', 
                height: '4px', 
                backgroundColor: `hsl(${post.hue}, 40%, 40%)`, 
                marginBottom: '1.5rem' 
              }} />
              <span style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Dispatch #{post.hash.toString(16).toUpperCase()}
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'normal', margin: '1rem 0', lineHeight: 1.1, letterSpacing: '-1px' }}>
                {post.title}
              </h2>
              <p style={{ fontSize: '1rem', color: '#444', lineHeight: 1.6, fontFamily: 'Georgia, serif', flexGrow: 1 }}>
                {post.summary}
              </p>
              <div style={{ marginTop: '2rem', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                READ ANALYSIS →
              </div>
            </article>
          </Link>
        ))}
      </section>

      <footer style={{ padding: '8rem 2rem', textAlign: 'center', backgroundColor: '#000', color: '#fff' }}>
        <p style={{ letterSpacing: '8px', textTransform: 'uppercase', fontSize: '0.9rem' }}>The Intelligence Archive is complete.</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .post-card:hover { background-color: #f4f4f4 !important; }
        @media (max-width: 600px) {
          header { padding: 2rem 1rem; }
          h1 { letter-spacing: -2px; }
        }
      `}} />
    </main>
  );
}
