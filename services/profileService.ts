
import { supabase } from '../supabaseClient';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
}

export const profileService = {
  async getMyProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }
    return data;
  },

  async updateProfile(updates: Partial<Profile>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;
  }
};
