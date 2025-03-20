export type Physio = {
    id:string,
    name:string, 
    email:string, 
    profilePic_URL:string, 
    cert_URL:string, 
    specialisation:string, 
    ratings:string,
    address: string,
    about: string,
    created_at: Date,
    updated_at: Date
};

export type Review = {
    user_id: string,
    physioTherapist_id: string,
    physioClinic_id: string,
    review_description: string,
    review_rating: number,
    review_date: Date,
    created_at: Date,
    updated_at: Date
}
