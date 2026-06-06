import { VertexAI } from "@google-cloud/vertexai";
import { Place, TripRequest, TripPlan, TripPlanSchema } from "@/src/lib/types";

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || "thai-trip-planner-498416",
  location: "us-central1"
});

// Build a minimal, safe representation of places to keep the prompt token count low.
function serializePlaces(places: Place[]) {
  return places.map((p) => ({
    id: p.id,
    name: p.name,
    name_en: p.name_en,
    category: p.category,
    province: p.province,
    lat: p.lat,
    lng: p.lng,
    price_range: p.price_range,
    vibe: p.vibe,
    description: p.description,
    affiliate_url: p.affiliate_url,
  }));
}

export async function generateTripPlan(
  request: TripRequest,
  places: Place[]
): Promise<TripPlan> {
  const model = vertexAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
  const langPrompt = request.language === "en" ? "English" : "Thai";

  const prompt = `
You are a Thai travel expert. Create a detailed trip plan based on the following requirements.
Respond ONLY with a valid JSON object. Do not include markdown fences or extra text.
IMPORTANT: All textual content (titles, summaries, descriptions, tips) MUST be written in ${langPrompt}.

Requirements:
- Province: ${request.province}
- Duration: ${request.days} days
- Budget: ${request.budget} THB for ${request.travelers} people
- Trip Style: ${request.style.join(", ")}
- Extra Preferences: ${request.preferences || "None"}

Available places in the system (prefer these, but you may suggest real Thai places not in the list):
${JSON.stringify(serializePlaces(places), null, 2)}

Required JSON structure:
{
  "title": "Trip title in ${langPrompt}",
  "summary": "1-2 sentence summary in ${langPrompt}",
  "days": [
    {
      "day": 1,
      "title": "Day 1 title in ${langPrompt}",
      "activities": [
        {
          "time": "08:00",
          "place_name": "Place name in ${langPrompt}",
          "place_id": "uuid or null",
          "category": "food|drink|hotel|activity|attraction",
          "description": "Description in ${langPrompt}",
          "duration_minutes": 60,
          "estimated_cost": 200,
          "tip": "Helpful tip in ${langPrompt}",
          "lat": 18.7883,
          "lng": 98.9853,
          "affiliate_url": "https://... or null"
        }
      ],
      "total_cost": 1500
    }
  ],
  "total_budget": 3000,
  "tips": ["General travel tip in ${langPrompt}", "Another tip in ${langPrompt}"]
}
`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const result = await model.generateContent(prompt);
    clearTimeout(timeout);

    const rawText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Strip potential markdown code fences if the model wraps the JSON
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    // Validate the AI output structure with Zod before returning
    const validated = TripPlanSchema.parse(parsed);
    return validated;
  } catch (error) {
    clearTimeout(timeout);

    if (error instanceof SyntaxError) {
      throw new Error("AI returned an invalid JSON response. Please try again.");
    }

    throw new Error("Failed to generate trip plan. Please try again.");
  }
}

export async function matchProvince(request: TripRequest): Promise<string> {
  const model = vertexAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

  const prompt = `You are a Thai travel expert. The user wants to visit Thailand but doesn't know which province to choose.
Match their preferences to EXACTLY ONE of the 77 provinces of Thailand.

User Requirements:
- Duration: ${request.days} days
- Budget: ${request.budget} THB for ${request.travelers} people
- Trip Style: ${request.style.join(", ")}
- Extra Preferences: ${request.preferences || "None"}

Respond ONLY with the official Thai name of the best matching province (e.g., "เชียงใหม่" or "ภูเก็ต"). Do not include any other text, explanation, or punctuation.`;

  try {
    const result = await model.generateContent(prompt);
    const text = (result.response.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
    return text;
  } catch (error) {
    console.error("Error matching province:", error);
    return "กรุงเทพมหานคร"; // Default fallback to Bangkok
  }
}
