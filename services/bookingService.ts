
import { supabase } from '../supabaseClient';
import { Booking } from '../types';

export const bookingService = {
  async createBooking(booking: Omit<Booking, 'id' | 'status'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{ ...booking, status: 'Pending' }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMyBookings(role: 'tenant' | 'landlord') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const queryField = role === 'tenant' ? 'tenant_id' : 'landlord_id';

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq(queryField, user.id)
      .order('viewing_date', { ascending: true });

    if (error) throw error;
    return data as Booking[];
  },

  async updateStatus(id: string, status: Booking['status']) {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
  }
};
