
import { supabase } from '../supabaseClient';
import { Listing, ListingCategory } from '../types';

export const listingService = {
  async getPaginated(page: number = 0, limit: number = 10) {
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    return (data || []).map(this.mapListing);
  },

  async getBySeller(sellerId: string) {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(this.mapListing);
  },

  async createListing(listing: Partial<Listing>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Authentication required");

    const payload = {
      title: listing.title,
      price: listing.price,
      price_type: 'rent',
      location: listing.location,
      image_url: listing.imageUrl,
      description: listing.description,
      seller_id: user.id,
      seller_name: user.user_metadata.full_name || 'Landlord',
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      category: ListingCategory.HOUSE_RENTAL,
      phone_number: user.phone || '0999000000'
    };

    const { data, error } = await supabase
      .from('listings')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return this.mapListing(data);
  },

  async deleteListing(id: number) {
    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (error) throw error;
  },

  mapListing(dbItem: any): Listing {
    return {
      ...dbItem,
      priceType: dbItem.price_type,
      imageUrl: dbItem.image_url,
      sellerId: dbItem.seller_id,
      sellerName: dbItem.seller_name,
      isVerified: dbItem.is_verified || false,
      is_promoted: dbItem.is_promoted || false,
      phoneNumber: dbItem.phone_number || '0999000000',
      amenities: dbItem.amenities || []
    } as Listing;
  }
};
