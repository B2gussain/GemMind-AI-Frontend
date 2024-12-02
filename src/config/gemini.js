import { 
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Use the API key from environment variables
const apiKey = import.meta.env.VITE_API_KEY;

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Configure the generative model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Generation configuration settings
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to run the generative model with a prompt
async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  const response = result.response;

  console.log(await response.text());
  return response.text();
}

export default run;
