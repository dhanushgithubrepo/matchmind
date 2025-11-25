const https = require("https");

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL = process.env.HF_EMBEDDING_MODEL || "intfloat/e5-base-v2";

const HF_URL = `https://router.huggingface.co/hf-inference/models/${encodeURIComponent(
  MODEL
)}/pipeline/feature-extraction`;

// helper
function postJSON(url, payload) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);

    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname,
        method: "POST",
        port: 443,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(`HTTP ${res.statusCode} ${data}`));
          }
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve([]);
          }
        });
      }
    );

    req.on("error", reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

async function getEmbedding(text) {
  if (!text || !text.trim()) return [];

  try {
    const response = await postJSON(HF_URL, {
      inputs: text.trim(),
    });

    // Case A: pooled embedding already (1D array)
    if (Array.isArray(response) && response.length > 0 && response.every((x) => typeof x === 'number')) {
      const clean = response.map((v) => Number(v)).filter((v) => Number.isFinite(v));
      return clean.length > 0 ? clean : [];
    }

    // Case B: token-level embeddings (2D array) -> mean pool
    if (Array.isArray(response) && Array.isArray(response[0])) {
      const tokens = response;
      const dim = tokens[0].length;
      const sum = new Array(dim).fill(0);
      let count = 0;
      for (const t of tokens) {
        if (Array.isArray(t) && t.length === dim) {
          for (let i = 0; i < dim; i++) sum[i] += Number(t[i]) || 0;
          count++;
        }
      }
      if (count === 0) return [];
      const pooled = sum.map((v) => v / count).map((v) => Number(v)).filter((v) => Number.isFinite(v));
      return pooled.length > 0 ? pooled : [];
    }

    console.warn("Unexpected embedding:", response);
    return [];
  } catch (err) {
    console.error("Embedding generation FAILED:", err.message);
    return [];
  }
}

module.exports = { getEmbedding };
