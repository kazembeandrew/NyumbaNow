
import { supabase } from '../supabaseClient';

export const authService = {
  /**
   * Normalizes Malawi numbers to +265 format
   */
  formatMalawiPhone(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('265')) return `+${cleaned}`;
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    return `+265${cleaned}`;
  },

  /**
   * Sends a 6-digit OTP to the user's phone number.
   */
  async signInWithPhone(phone: string) {
    const formattedPhone = this.formatMalawiPhone(phone);
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Verifies the OTP token.
   */
  async verifyOTP(phone: string, token: string) {
    const formattedPhone = this.formatMalawiPhone(phone);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: 'sms',
    });
    if (error) throw error;
    return data;
  },

  /**
   * Standard Email/Password Login
   */
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Logout
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
