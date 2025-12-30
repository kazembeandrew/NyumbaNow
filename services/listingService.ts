
import { supabase } from '../supabaseClient';
import { Listing, ListingCategory } from '../types';

export const listingService = {
  /**
   * Fetches a paginated list of properties.
   * Uses a safer selection to avoid crashes if new columns aren't added yet.
   */
  async getPaginated(page: number = 0, limit: number = 10) {
    const from = page * limit;
    const to = from + limit - 1;

    // We select only the core columns that are definitely there
    // If you add is_promoted to your DB, you can add it back to the .order()
    const { data, error } = await supabase
      .from('listings')
      .select('id, title, price, price_type, location, image_url, seller_id, seller_name, bedrooms, bathrooms')
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) {
      console.error("Supabase Fetch Error:", error.message);
      throw error;
    }
    
    if (!data) return [];

    return data.map(i => ({ 
      ...i, 
      priceType: i.price_type, 
      imageUrl: i.image_url, 
      sellerId: i.seller_id, 
      sellerName: i.seller_name,
      // Defaulting these to false/null if the columns are missing from the response
      isVerified: (i as any).is_verified || false,
      is_promoted: (i as any).is_promoted || false,
      phoneNumber: (i as any).phone_number || '0999000000',
      amenities: [] 
    })) as Listing[];
  },

  async getById(id: number) {
    // Using * is safer for the detail view as it just returns whatever columns exist
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { 
      ...data, 
      priceType: data.price_type, 
      imageUrl: data.image_url, 
      sellerId: data.seller_id, 
      sellerName: data.seller_name,
      isVerified: data.is_verified || false,
      is_promoted: data.is_promoted || false,
      phoneNumber: data.phone_number || '0999000000',
      amenities: data.amenities || []
    } as Listing;
  }
};
