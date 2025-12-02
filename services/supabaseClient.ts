import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------
// CONFIGURATION BASE DE DONNÉES (SUPABASE)
// ---------------------------------------------------------
// 1. Créez un projet gratuit sur https://supabase.com
// 2. Copiez l'URL et la clé ANON publique depuis les paramètres API
// 3. Remplacez les valeurs ci-dessous
// ---------------------------------------------------------

const SUPABASE_URL = 'https://votre-projet.supabase.co';
const SUPABASE_ANON_KEY = 'votre-cle-publique-anon';

// Initialisation du client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);