import { NextRequest, NextResponse } from "next/server";
import { PROVINCE_NAMES_EN } from "@/src/lib/constants";

// Generate mock hotels for a given province to display in the UI
function generateMockHotels(province: string, provider: string) {
  const englishName = PROVINCE_NAMES_EN[province] || province;
  const basePrice = Math.floor(Math.random() * 2000) + 1000;
  
  return [
    {
      id: `${provider}-1`,
      name: `Grand ${englishName} Resort`,
      rating: 4.8,
      reviews: Math.floor(Math.random() * 500) + 100,
      price: basePrice,
      currency: "THB",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80",
    },
    {
      id: `${provider}-2`,
      name: `${englishName} Boutique Hotel`,
      rating: 4.5,
      reviews: Math.floor(Math.random() * 300) + 50,
      price: Math.floor(basePrice * 0.7),
      currency: "THB",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80",
    },
    {
      id: `${provider}-3`,
      name: `Budget Inn ${englishName}`,
      rating: 4.0,
      reviews: Math.floor(Math.random() * 200) + 20,
      price: Math.floor(basePrice * 0.4),
      currency: "THB",
      image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=500&q=80",
    }
  ];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const province = searchParams.get("province");
    const provider = searchParams.get("provider"); // 'agoda', 'trip', 'traveloka'

    if (!province || !provider) {
      return NextResponse.json(
        { error: "Missing required parameters: province and provider" },
        { status: 400 }
      );
    }

    const englishName = PROVINCE_NAMES_EN[province] || province;
    const encodedName = encodeURIComponent(englishName);
    
    let searchUrl = "";

    // Generate deep-links
    switch (provider.toLowerCase()) {
      case "agoda":
        searchUrl = `https://www.agoda.com/search?text=${encodedName}`;
        break;
      case "trip":
        searchUrl = `https://us.trip.com/hotels/list?keyword=${encodedName}`;
        break;
      case "traveloka":
        searchUrl = `https://www.traveloka.com/en-th/hotel/search?q=${encodedName}`;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid provider. Supported: agoda, trip, traveloka" },
          { status: 400 }
        );
    }

    const mockHotels = generateMockHotels(province, provider);

    return NextResponse.json({
      provider,
      province,
      searchUrl,
      hotels: mockHotels,
    });
  } catch (error) {
    console.error("GET OTA search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
