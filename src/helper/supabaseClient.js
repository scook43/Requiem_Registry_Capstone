import { SupabaseClient} from "@supabase/supabase-js";

const supabaseURL = "https://lvgtdqwcxxukbcjsnwig.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2Z3RkcXdjeHh1a2JjanNud2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjAwMDMsImV4cCI6MjA1ODUzNjAwM30.rMRu0hHKoteioxIUxymENlr7NiGczXTcKBfqHU4IPN4";

const supabaseClient = new SupabaseClient(supabaseURL, supabaseAnonKey);

export default supabaseClient;
