import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AppService {
  private supabase: SupabaseClient;

  constructor() {
    // Safely pulling from the environment!
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are missing!');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // GET: Fetch the latest 100 messages
  async getChats() {
    const { data, error } = await this.supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  // POST: Insert a new message into the database
  async addChat(email: string, name: string, message: string) {
    const { data, error } = await this.supabase
      .from('chats')
      .insert([{ email, name, message }])
      .select(); // Return the inserted row

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}