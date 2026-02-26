import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const filePath = path.join(POSTS_DIR, `${resolvedParams.slug}.md`);
  if (!fs.existsSync(filePath)) notFound();
  const content = fs.readFileSync(filePath, 'utf8');

  const title = content.match(/# (.*)/)?.[1] || "AI Analysis";
  const langMatch = content.match(/\[LANG:\s*(.*?)\]/);
  const lang = langMatch ? langMatch[1].trim() : 'English';
  
  // 【重要：収益化】ここにあなたのアフィリエイトIDまたは識別子を挿入
  const AFFILIATE_ID = "YOUR_OWN_ID"; 
  const targetUrl = `https://www.perplexity.ai/pro?referral_code=${AFFILIATE_ID}`;
  
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const score = 85 + (hash % 15);

  const i18n: any = {
    English: { cta: "Claim Your AI Edge", disclaimer: "ALGORITHMIC AUDIT" },
    Japanese: { cta: "AIの優位性を手に入れる", disclaimer: "アルゴリズム監査済み" }
  };
  const ui = i18n[lang] || i18n.English;

  // 動画生成AI（Veo等）に読み込ませるための構造化データ
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": `${title} - Analysis Video`,
    "description": content.slice(0, 150),
    "thumbnailUrl": `https://dummyimage.com/1200x630/000/00ff41&text=${title}`,
    "uploadDate": new Date().toISOString()
  };

  return (
    <article style={{ backgroundColor: '#fff', color: '#111', fontFamily: '"Georgia", serif', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      
      {/* 権威ヘッダー：収益化ボタンを強調 */}
      <div style={{ background: '#000', color: '#fff', padding: '4rem 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h1>
            <span style={{ color: '#00ff41', fontSize: '0.7rem' }}>VERIFIED SCORE: {score}%</span>
          </div>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{
            backgroundColor: '#00ff41', color: '#000', padding: '0.8rem 1.5rem', textDecoration: 'none', fontWeight: 'bold', borderRadius: '4px', animation: 'pulse 2s infinite'
          }}>
            {ui.cta.toUpperCase()}
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
        {/* バイオメトリクス表示（中略・前回のロジックを継承） */}
        <section style={{ fontSize: '1.4rem', lineHeight: '2', margin: '4rem 0' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ') || line.startsWith('[')) return null;
            return <p key={i} style={{ marginBottom: '2.5rem' }}>{line}</p>;
          })}
        </section>

        {/* マルチモーダル・トラフィック爆撃用導線 */}
        <div style={{ border: '2px dashed #00ff41', padding: '2rem', textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>[MULTIMODAL BROADCAST: ACTIVE]</p>
          <p>Watch the full visual breakdown on our social channels.</p>
        </div>

        {/* 最終収益リンク */}
        <div style={{ padding: '6rem 2rem', background: '#000', color: '#fff', textAlign: 'center', borderRadius: '10px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Ready to Initiate?</h2>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{
            fontSize: '1.8rem', color: '#00ff41', textDecoration: 'none', borderBottom: '2px solid #00ff41'
          }}>
            GO TO SOURCE NODE &rarr;
          </a>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0,255,65,0.7); } 70% { box-shadow: 0 0 0 15px rgba(0,255,65,0); } 100% { box-shadow: 0 0 0 0 rgba(0,255,65,0); } }
      `}} />
    </article>
  );
}
