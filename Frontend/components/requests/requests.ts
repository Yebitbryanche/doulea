import apiClient from "@/app/apiClient"

export const getUserFav = async (user_id:string|undefined) => {
    try{
        const response  = await apiClient.get('/job/liked_jobs',{params:{user_id}})
        console.log(response.data)
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
        console.log(response.data)
        return response

    }
    catch(error:any){
        console.error(error.message)
    }
}