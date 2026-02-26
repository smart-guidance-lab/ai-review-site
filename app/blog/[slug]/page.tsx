import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => ({
      slug: f.replace('.md', ''),
      mtime: fs.statSync(path.join(POSTS_DIR, f)).mtimeMs,
      title: fs.readFileSync(path.join(POSTS_DIR, f), 'utf8').match(/# (.*)/)?.[1] || "Untitled Report"
    }))
    .sort((a, b) => b.mtime - a.mtime);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const filePath = path.join(POSTS_DIR, `${resolvedParams.slug}.md`);
  if (!fs.existsSync(filePath)) return { title: "Not Found" };
  const content = fs.readFileSync(filePath, 'utf8');
  const title = content.match(/# (.*)/)?.[1] || "AI Insight Report";
  const summaryMatch = content.match(/Summary:\s*(.*)/i);
  const description = summaryMatch ? summaryMatch[1].slice(0, 150) + '...' : `${title} Analysis.`;
  return { title: `${title} | AI Insight Global`, description };
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const posts = getAllPosts();
  const currentIndex = posts.findIndex(p => p.slug === resolvedParams.slug);
  const nextPost = posts[(currentIndex + 1) % posts.length]; // 循環して次の記事へ

  const filePath = path.join(POSTS_DIR, `${resolvedParams.slug}.md`);
  if (!fs.existsSync(filePath)) notFound();
  const content = fs.readFileSync(filePath, 'utf8');
  const targetUrl = content.match(/\[TARGET_URL:\s*(.*?)\]/)?.[1] || '/';
  const title = content.match(/# (.*)/)?.[1] || "AI Insight Report";

  // ビジュアルハッシュ
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;

  return (
    <article style={{ backgroundColor: '#fff', color: '#111', fontFamily: '"Georgia", serif', minHeight: '100vh' }}>
      
      {/* ヘッダービジュアル */}
      <div style={{
        background: `linear-gradient(135deg, hsl(${hue}, 20%, 10%) 0%, #000 100%)`,
        height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.4, background: `radial-gradient(circle at 50% 50%, hsl(${hue}, 100%, 50%, 0.1), transparent)` }} />
        <div style={{ position: 'relative', zIndex: 10, width: '90%', maxWidth: '1000px', textAlign: 'left' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Sequence 0x{hash.toString(16)}</span>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2.5rem, 8vw, 6rem)', margin: '1rem 0', lineHeight: 1, letterSpacing: '-3px' }}>{title}</h1>
        </div>
      </div>

      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '6rem 2rem' }}>
        <nav style={{ marginBottom: '8rem', borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
          <a href="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem' }}>&larr; INDEX ARCHIVE</a>
        </nav>

        {/* 本文 */}
        <section style={{ fontSize: '1.4rem', lineHeight: '2', color: '#222', textAlign: 'justify' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ') || line.startsWith('[')) return null;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '3rem', marginTop: '8rem', marginBottom: '2rem', borderTop: '8px solid #000', paddingTop: '2rem' }}>{line.replace('## ', '')}</h2>;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ margin: '5rem 0', paddingLeft: '3rem', borderLeft: '15px solid #000', fontStyle: 'italic', fontSize: '1.8rem' }}>{line.replace('> ', '')}</blockquote>;
            return line.trim() ? <p key={i} style={{ marginBottom: '2.5rem' }}>{line}</p> : null;
          })}
        </section>

        {/* 【回遊リンク】Next Reportへの強力な導線 */}
        <div style={{ marginTop: '15rem', padding: '6rem', backgroundColor: '#f9f9f9', border: '1px solid #eee', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '5px', color: '#888', textTransform: 'uppercase' }}>Next Intelligence Report</span>
          <h4 style={{ fontSize: '2.5rem', margin: '1.5rem 0 3rem 0', lineHeight: 1.2 }}>{nextPost.title}</h4>
          <a href={`/blog/${nextPost.slug}`} style={{
            display: 'inline-block', backgroundColor: '#000', color: '#fff', padding: '1.5rem 5rem', textDecoration: 'none', fontWeight: 'bold', letterSpacing: '3px'
          }}>CONTINUE ANALYSIS →</a>
        </div>

        <footer style={{ marginTop: '10rem', textAlign: 'center', opacity: 0.3 }}>
          <p>© 2026 AI Insight Global / Node {hash}</p>
          <a href={targetUrl} style={{ color: '#000' }}>Official Portal Source</a>
        </footer>
      </div>
    </article>
  );
}
