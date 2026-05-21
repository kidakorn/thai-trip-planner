import { GoogleGenerativeAI } from "@google/generative-ai";
import { Place, TripRequest, TripPlan, TripPlanSchema } from "@/src/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a Thai travel expert. Create a detailed trip plan based on the following requirements.
Respond ONLY with a valid JSON object. Do not include markdown fences or extra text.

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
  "title": "Trip title in Thai",
  "summary": "1-2 sentence summary in Thai",
  "days": [
    {
      "day": 1,
      "title": "Day 1 title in Thai",
      "activities": [
        {
          "time": "08:00",
          "place_name": "Place name",
          "place_id": "uuid or null",
          "category": "food|drink|hotel|activity|attraction",
          "description": "Description in Thai",
          "duration_minutes": 60,
          "estimated_cost": 200,
          "tip": "Helpful tip in Thai",
          "lat": 18.7883,
          "lng": 98.9853,
          "affiliate_url": "https://... or null"
        }
      ],
      "total_cost": 1500
    }
  ],
  "total_budget": 3000,
  "tips": ["General travel tip in Thai", "Another tip"]
}
`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const result = await model.generateContent(prompt);
    clearTimeout(timeout);

    const rawText = result.response.text();

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
