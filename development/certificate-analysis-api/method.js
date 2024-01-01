import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database

class Method{
    // Institution Id
    constructor(id){
        this.total = 52; // Total remark of the certificate
        this.certificates = [];
        this.institional_details = {};
        this.institutionId = id;
        this.remarks = [];
        this.supabase =  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)       
    }

    async fetchInstitutionDetails(){ 
        const {data,error} = this.supabase.from('institutions').select('*').eq('id',this.id);

    }

   async  fetchInstitutionCertificates(){
         const  {data,error} =    await this.supabase.from('certifications').select('*').eq('institution_id',this.institutionId);
        if(error){
            throw error;
        }
         this.certificates = data;
            }

    async getCertificateRemark(name){
        const  {data,error} =    await this.supabase.from('certificate_remarks').select('remark').eq('name',name);
        if(error){
            throw error;
        }
        return data[0].remark;
    }

   async updateRemark(){
    let total = 0;
    await this.fetchInstitutionDetails();
      await this.fetchInstitutionCertificates();
      for (let index = 0; index < this.certificates.length; index++) {
        const element = this.certificates[index];                                       
          this.remarks.push (await this.getCertificateRemark(element.name));
      }
      for (let index = 0; index < array.length; index++) {
        total += this.remarks[index];
      }
      await this.supabase.from("institution_esg_ranking_leader_board").selec
   } 


}



