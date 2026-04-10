/* 
 * Supabase Initialization 
 * Uses the exact environment variables from original workspace
 */
const SUPABASE_URL = 'https://cbbarbmifohpgwtdnksq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiYmFyYm1pZm9ocGd3dGRua3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTQ2MzcsImV4cCI6MjA5MDczMDYzN30.uhcmMhnfh9g5dgq2ymkwNMGDB4nvKHRVZbsCq4SN_1s';

window.supabaseClient = window.supabase;
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
