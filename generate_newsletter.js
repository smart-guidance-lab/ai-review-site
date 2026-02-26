const fs = require('fs');
const path = require('path');

async function generatePersonalizedNewsletters() {
    const postsDir = path.join(process.cwd(), 'content/posts');
    const allPosts = fs.readdirSync(postsDir).map(file => {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const category = content.match(/\[IMG_KEYWORD:\s*(.*?)\]/)?.[1] || 'General';
        return { file, category, title: content.match(/# (.*)/)?.[1] };
    });

    const segments = ['LLM', 'Design', 'Video', 'Search'];
    
    segments.forEach(seg => {
        const matchedPosts = allPosts.filter(p => p.category === seg).slice(0, 3);
        let draft = `<h1>EXCLUSIVE INSIGHT: ${seg} FOCUS</h1>`;
        matchedPosts.forEach(p => {
            draft += `<p><strong>${p.title}</strong><br><a href="https://your-domain.com/blog/${p.file.replace('.md', '')}">Analyze Data</a></p>`;
        });
        fs.writeFileSync(`newsletter_${seg.toLowerCase()}.html`, draft);
    });
    console.log("Segmented Newsletters Ready.");
}
generatePersonalizedNewsletters();
