// SAT Practice Questions Seeder
// This script populates the Supabase database with questions

// Supabase configuration - Update these with your actual Supabase credentials
const SUPABASE_URL = 'https://ufmoftsasbwfeqerilpq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbW9mdHNhc2J3ZmVxZXJpbHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MzY3NjksImV4cCI6MjA4MDQxMjc2OX0.qGp-15_VWEPaK0vaCbmT2bIL0xd0Ntchh-ahvKiOOLw'; // Use service role key for write access

console.log('SAT Question Seeder');
console.log('Database will be empty initially.');
console.log('You can add questions through the Supabase dashboard or create your own seeding script.');