import apiClient from "@/app/apiClient"

export const getUserFav = async (user_id:string|undefined) => {
    try{
        const response  = await apiClient.get('/job/liked_jobs',{params:{user_id}})
        //console.log(response.data)
        return response.data
    }
    catch(error:any){
        console.error(error.response.data)
    }
}


// calling review endpoint 

export const writeReview = async (
    user_id:string | undefined, 
    rating:number,
    review:string,
    comment:string,
    employer_id:string | string[]
    ) => {
    try{
        const response = await apiClient.post(`/users/review/${user_id}`,{
            rating,
            review,
            comment,
            employer_id
        })
        return response.data
    }
    catch(error:any){
        console.error(error.response.data || error.message)
    }
}

// review end point for getting all reviews

export const getReviews = async (id:string | string[], offset:number, limit:number) => {
    try{
        const response = await apiClient.get(`/users/employer/${id}?limit=${limit}&offset=${offset}`)
        return response.data
    }
    catch(error:any){
        console.error(error.message)
    }
}

// user profile update request
export const updateProfile = async (
    id:string|undefined,
    user_name:string|undefined,
    email:string|undefined,
    phone:string | undefined, 
    address:string | undefined,
    bio:string|undefined) => {
    try{
        const response = await apiClient.put(`/users/update_profile/${id}`,
            {
                user_name,
                email,
                phone,
                address,
                bio,
            }
            
        )
        //console.log(response.data)
        return response

    }
    catch(error:any){
        console.error(error.message)
    }
}

/////////////////////////////////////////
// get employer posts by id
////////////////////////////////////////

export const getEmployer_jobs = async (id:string|undefined) => {
    try{
        const response = await apiClient.get(`/job/uploads/${id}`)
        //console.log(response.data)
        return response.data
    }
    catch(error:any){
        console.error(error.message)
    }
}


//// calling the endpoint to edit a particular job
export const editJob = async (
    id:string|string[],
    title:string | undefined,
    description:string | undefined,
    payment:number | undefined,
    location:string | undefined,
    category:string[] | undefined
        ) => {
    try{
        const response = await apiClient.put(`/job/update_job/${id}`,
            {
                title,
                description,
                payment,
                location,
                category
            }
        );
        //console.log(response.data)
        return response.data
    }
    catch(error:any){
        console.error(error.message)
    }
}

//delete listing

export const deleteJob = async (id:string|undefined) => {
    try{
        const response = await apiClient.delete(`/job/delete/job/${id}`)
        return response.data
    }
    catch(error:any){
        console.error(error.message)
    }
}


// payment request


export const initiatePayment = async (id:string | undefined, amount:number) => {
    try{ 
        const response = await apiClient.post('/users/payments',{id,amount})
        return response.data
    }
    catch(error:any){
        console.error(error.response.data)
        return null
    }
}


