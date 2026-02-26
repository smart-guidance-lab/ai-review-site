const fs = require('fs');
const path = require('path');

async function generateNurtureScenarios() {
    const langs = ['English', 'Japanese', 'Chinese', 'Spanish'];
    const categories = ['LLM', 'Design', 'Video', 'Search'];
    const nurtureDir = path.join(process.cwd(), 'content/nurture');

    if (!fs.existsSync(nurtureDir)) fs.mkdirSync(nurtureDir, { recursive: true });

    langs.forEach(lang => {
        categories.forEach(cat => {
            for (let day = 0; day <= 6; day++) {
                const fileName = `${lang}-${cat}-day${day}.md`;
                const content = `Subject: [Day ${day}] The ${cat} Revolution for ${lang} Users
                
                Content:
                This is your Day ${day} intelligence briefing. 
                Focus: How ${cat} is shifting the global landscape.
                [VALUE_PROPOSITION_HERE]
                
                CTA: Read today's deep dive here...`;
                
                fs.writeFileSync(path.join(nurtureDir, fileName), content);
            }
        });
    });
    console.log("Global Nurture Scenarios Generated.");
}
generateNurtureScenarios();
