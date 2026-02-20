import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CATEGORIES = [
  "AI Law",
  "AI Accounting",
  "AI Medical Scribe",
  "AI Marketing",
  "AI Customer Support",
  "AI Code Review",
];

function pickTopic(): string {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function generateReview(): Promise<void> {
  const topic = pickTopic();
  const slug = slugify(topic);
  const postsDir = path.join(process.cwd(), "content", "posts");

  const prompt = `You are a professional software reviewer. Write a single, coherent product review article in professional English.

Topic: An AI tool in the category "${topic}". You may invent a plausible product name (e.g. "LexAI" for AI Law, "LedgerMind" for AI Accounting).

Requirements:
- Length: approximately 1,500 words.
- Use Markdown only (no HTML).
- Structure the article with these sections:
  1. **Title** – One clear, SEO-friendly headline.
  2. **Introduction** – 2–3 sentences on what the tool is and who it’s for.
  3. **Key Features** – 4–5 bullet points or short paragraphs.
  4. **Pros and Cons** – Use a Markdown table with columns "Pros" and "Cons", 4–6 rows total.
  5. **Pricing** – Describe tiers or pricing model in a short subsection.
  6. **Use Cases** – 3–4 concrete scenarios (e.g. "Small law firms reviewing contracts", "Freelancers tracking expenses").
  7. **Conclusion** – Brief summary and recommendation.

Write in a neutral, expert tone. Output only the Markdown body (no meta commentary).`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI returned no content");
  }

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const fileName = `${slug}-${Date.now()}.md`;
  const filePath = path.join(postsDir, fileName);
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Generated: content/posts/${fileName}`);
}

generateReview().catch((err) => {
  console.error(err);
  process.exit(1);
});
