// Hugging Face
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_GENERATION_MODEL = process.env.HF_GENERATION_MODEL || 'google/gemma-7b-it';
const HF_GEN_URL = `https://api-inference.huggingface.co/models/${HF_GENERATION_MODEL}`;

async function generateWithHuggingFace(prompt) {
  if (!HF_API_KEY) throw new Error('HUGGINGFACE_API_KEY is not set');
  const res = await fetch(HF_GEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 128, temperature: 0.2, return_full_text: false },
      options: { wait_for_model: true }
    })
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`HF generate error: ${res.status} ${t}`);
  }
  const data = await res.json();
  // Response shape can be [{generated_text: "..."}] or {generated_text: ...}
  if (Array.isArray(data) && data[0]?.generated_text) return data[0].generated_text;
  if (data?.generated_text) return data.generated_text;
  return typeof data === 'string' ? data : '';
}

async function generate(prompt) {
  return generateWithHuggingFace(prompt);
}

async function expandHrQuery(raw) {
  const system = `You rewrite HR job requirements into a concise normalized description including skills, seniority, stack, and domain. Keep it under 60 words.`;
  const prompt = `${system}\nRequirement: ${raw}\nNormalized:`;
  return generate(prompt);
}

module.exports = { expandHrQuery };
