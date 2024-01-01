const { createClient } = require('@supabase/supabase-js');

class SupabaseHelper{
    constructor(){
      this.supabase  = createClient(process.env.SUPABASE_URl,process.env.SUPABASE_KEY)
    }

    createFile(created_by,){

    }
}