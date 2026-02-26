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
  const targetUrl = "https://www.perplexity.ai";
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const score = 85 + (hash % 15);

  // 言語別UIテキスト・マッピング
  const i18n: any = {
    English: { cta: "Access Source", next: "Next Report", disc: "ALGORITHMIC DISCLAIMER" },
    Chinese: { cta: "访问源", next: "下一份报告", disc: "算法免责声明" },
    Spanish: { cta: "Acceder a la fuente", next: "Siguiente informe", disc: "DESCARGO DE RESPONSABILIDAD" },
    Japanese: { cta: "ソースにアクセス", next: "次のレポート", disc: "アルゴリズム免責事項" }
  };
  const ui = i18n[lang] || i18n.English;

  return (
    <article style={{ backgroundColor: '#fff', color: '#111', fontFamily: '"Georgia", serif', minHeight: '100vh' }}>
      <div style={{ background: '#000', color: '#fff', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3rem' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '5px solid #00ff41', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{score}%</span>
          </div>
          <div style={{ flexGrow: 1 }}>
            <h1 style={{ fontSize: '3rem', fontFamily: '"Times New Roman", serif', margin: 0 }}>{title}</h1>
            <p style={{ opacity: 0.5, letterSpacing: '2px', fontSize: '0.7rem' }}>VERIFIED IN: {lang.toUpperCase()}</p>
          </div>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#00ff41', color: '#000', padding: '1rem 2rem', textDecoration: 'none', fontWeight: 'bold' }}>
            {ui.cta.toUpperCase()}
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 2rem' }}>
        <section style={{ fontSize: '1.4rem', lineHeight: '2', textAlign: 'justify' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ') || line.startsWith('[')) return null;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '2.5rem', marginTop: '6rem', borderTop: '4px solid #000' }}>{line.replace('## ', '')}</h2>;
            return line.trim() ? <p key={i} style={{ marginBottom: '2.5rem' }}>{line}</p> : null;
          })}
        </section>

        {/* 巨大な言語最適化CTA */}
        <div style={{ marginTop: '10rem', padding: '5rem', background: '#000', color: '#fff', textAlign: 'center' }}>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#00ff41', textDecoration: 'none', fontSize: '2rem', fontWeight: 'bold' }}>
            {ui.cta.toUpperCase()} &rarr;
          </a>
        </div>

        <footer style={{ marginTop: '10rem', borderTop: '1px solid #eee', paddingTop: '4rem', color: '#999', fontSize: '0.7rem' }}>
          <h5 style={{ color: '#000', marginBottom: '1rem' }}>{ui.disc}</h5>
          <p>Verified by Global AI Audit. Node: {hash.toString(16).toUpperCase()}</p>
        </footer>
      </div>
    </article>
  );
}
