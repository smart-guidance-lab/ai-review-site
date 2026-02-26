const fs = require('fs');
const path = require('path');

async function createNewsletter() {
    const postsDir = path.join(process.cwd(), 'content/posts');
    const files = fs.readdirSync(postsDir).sort().slice(0, 5); // 最新5件
    
    let digest = "<h1>AI INSIGHT GLOBAL WEEKLY DIGEST</h1>";
    files.forEach(file => {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const title = content.match(/# (.*)/)?.[1];
        digest += `<p><strong>${title}</strong><br><a href="https://your-domain.com/blog/${file.replace('.md', '')}">Read Full Audit</a></p>`;
    });

    digest += "<hr><p>Special Offer: <a href='YOUR_HIGH_TICKET_LINK'>Join our Executive AI Masterclass</a></p>";
    
    fs.writeFileSync('newsletter_draft.html', digest);
    console.log("Newsletter draft generated.");
}
createNewsletter();
