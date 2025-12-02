import { User } from '../types';
import { supabase } from './supabaseClient';

// METTRE À "true" UNE FOIS VOS CLÉS SUPABASE CONFIGURÉES DANS supabaseClient.ts
const USE_SUPABASE = false;

const DB_KEY = 'registre_nominal_users';

export const db = {
  /**
   * Retrieve all users from the database.
   */
  getAll: async (): Promise<User[]> => {
    try {
      if (USE_SUPABASE) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('createdAt', { ascending: false });
        
        if (error) throw error;
        return data as User[] || [];
      } else {
        // LocalStorage fallback
        const data = localStorage.getItem(DB_KEY);
        return data ? JSON.parse(data) : [];
      }
    } catch (error) {
      console.error('Error reading from DB', error);
      return [];
    }
  },

  /**
   * Add a single user to the database.
   */
  add: async (user: User): Promise<void> => {
    try {
      if (USE_SUPABASE) {
        // Supabase expects snake_case columns usually, but assuming 1:1 mapping for simplicity
        // Make sure your Supabase table 'users' has columns matching the User interface
        const { error } = await supabase.from('users').insert([user]);
        if (error) throw error;
      } else {
        // LocalStorage fallback
        const currentUsers = await db.getAll();
        const updated = [user, ...currentUsers];
        localStorage.setItem(DB_KEY, JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error saving to DB', error);
      throw error;
    }
  },

  /**
   * Remove a user by ID.
   */
  remove: async (id: string): Promise<void> => {
    try {
      if (USE_SUPABASE) {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;
      } else {
        // LocalStorage fallback
        const currentUsers = await db.getAll();
        const updated = currentUsers.filter(u => u.id !== id);
        localStorage.setItem(DB_KEY, JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error removing from DB', error);
      throw error;
    }
  },

  /**
   * Clear all users.
   */
  clear: async (): Promise<void> => {
    try {
      if (USE_SUPABASE) {
        // Caution: This deletes everything
        const { error } = await supabase.from('users').delete().neq('id', '0');
        if (error) throw error;
      } else {
        localStorage.removeItem(DB_KEY);
      }
    } catch (error) {
      console.error('Error clearing DB', error);
      throw error;
    }
  }
};