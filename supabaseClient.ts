
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// These credentials connect your app to your real Supabase backend.
const supabaseUrl = 'https://lvvtwsmwxcfkhsqsboao.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2dnR3c213eGNma2hzcXNib2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTc5MzAsImV4cCI6MjA4MTI5MzkzMH0.Lhq_Kd405cQ9wTPPLun9OfM8TPI2d0rPP-aUcVrnhls';

export const supabase = createClient(supabaseUrl, supabaseKey);
