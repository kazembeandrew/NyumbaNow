
import { supabase } from '../supabaseClient';
import { Listing, ListingCategory } from '../types';

export const listingService = {
  /**
   * Fetches a paginated list of properties.
   * Only selects essential columns for the list view to save data.
   */
  async getPaginated(page: number = 0, limit: number = 10) {
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('listings')
      .select('id, title, price, price_type, location, image_url, seller_id, seller_name, is_verified, bedrooms, bathrooms')
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return data.map(i => ({ 
      ...i, 
      priceType: i.price_type, 
      imageUrl: i.image_url, 
      sellerId: i.seller_id, 
      sellerName: i.seller_name,
      isVerified: i.is_verified || false,
      amenities: [] // Amenities not needed in list view
    })) as Listing[];
  },

  async getById(id: number) {
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
      amenities: data.amenities || []
    } as Listing;
  }
};
