
import { supabase } from '../supabaseClient';
import { Message, Conversation } from '../types';

export const chatService = {
  async getOrCreateConversation(listingId: number, landlordId: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Auth required");

    // Check if exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('tenant_id', user.id)
      .eq('landlord_id', landlordId)
      .eq('listing_id', listingId)
      .maybeSingle();

    if (existing) return existing.id;

    // Create new
    const { data: created, error } = await supabase
      .from('conversations')
      .insert([{
        tenant_id: user.id,
        landlord_id: landlordId,
        listing_id: listingId
      }])
      .select()
      .single();

    if (error) throw error;
    return created.id;
  },

  async sendMessage(conversationId: string, text: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        sender_id: user.id,
        text
      }]);

    if (error) throw error;
  },

  subscribeToMessages(conversationId: string, onMessage: (msg: Message) => void) {
    return supabase
      .channel(`chat:${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}` 
      }, (payload) => {
        onMessage(payload.new as Message);
      })
      .subscribe();
  }
};
