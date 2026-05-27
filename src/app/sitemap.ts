import { MetadataRoute } from 'next';
import { supabase } from '@/src/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let trips: any[] = [];
  let places: any[] = [];

  // If Supabase is configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { data: tripsData } = await supabase.from('trips').select('id, created_at');
    const { data: placesData } = await supabase.from('places').select('id, created_at'); // assuming created_at for places
    
    trips = tripsData || [];
    places = placesData || [];
  }
  
  return [
    { url: 'https://thaitrip.app', lastModified: new Date() },
    { url: 'https://thaitrip.app/plan', lastModified: new Date() },
    { url: 'https://thaitrip.app/places', lastModified: new Date() },
    ...trips.map(t => ({ url: `https://thaitrip.app/trip/${t.id}`, lastModified: t.created_at })),
    ...places.map(p => ({ url: `https://thaitrip.app/places/${p.id}`, lastModified: p.created_at })),
  ];
}
