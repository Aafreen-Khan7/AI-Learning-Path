
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in .env.local");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log("Listing models...");
    // The listModels method is available on the genAI object in newer SDK versions
    // But it's usually accessed via the GoogleAIStudio/Cloud client.
    // For this SDK, let's try a different approach to see if it's connected at all.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "working?";
    const result = await model.generateContent(prompt);
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
    if (error.message.includes("404")) {
        console.log("Model not found. This might be due to API versioning or key permissions.");
    }
  }
}

testGemini();
