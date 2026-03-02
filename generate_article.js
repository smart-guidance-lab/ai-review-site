const fs = require('fs');

const path = require('path');

const https = require('https');



async function generateArticle(lang = 'English') {

const toolData = [

{ name: 'Perplexity AI', url: 'https://www.perplexity.ai', category: 'Search' },

{ name: 'ChatGPT-5', url: 'https://chatgpt.com', category: 'LLM' },

{ name: 'Claude 3.5', url: 'https://claude.ai', category: 'Writing' }

];



const tool = toolData[Math.floor(Math.random() * toolData.length)];


// 言語に応じたシステム指示の最適化

const prompt = `Write a professional deep-dive essay in ${lang}.

Topic: ${tool.name}.

Style: Elite technology critic, analytical, and authoritative.

Structure:

- # Title

- > Summary (One paragraph)

- ## Analysis Part 1

- ## Analysis Part 2

- ## Editorial Verdict

Important: End with these tags:

[TARGET_URL: ${tool.url}]

[IMG_KEYWORD: ${tool.category}]

[LANG: ${lang}]`;



const data = JSON.stringify({

model: "gpt-4o",

messages: [{role: "system", content: "You are a global tech auditor."}, {role: "user", content: prompt}],

max_tokens: 2000

});



const options = {

hostname: 'api.openai.com', path: '/v1/chat/completions', method: 'POST',

headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }

};



const req = https.request(options, (res) => {

let body = '';

res.on('data', (d) => body += d);

res.on('end', () => {

try {

const response = JSON.parse(body);

const content = response.choices[0].message.content;

const blogDir = path.join(process.cwd(), 'content/posts');

if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

fs.writeFileSync(path.join(blogDir, `ai-${lang}-${Date.now()}.md`), content);

console.log(`Success: ${lang} article generated.`);

} catch (e) { console.error(e); }

});

});

req.write(data); req.end();

}



// 実行例: generateArticle('Chinese'); generateArticle('Spanish'); generateArticle('English');

generateArticle('English'); import fs from 'fs';
