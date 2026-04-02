interface EmployerDetailProps{
    address:string
    email:string
    is_verified:boolean
    phone:string
    user_name:string
    id:string
}

export interface JobDetailProps{
    created_at:string
    description:string
    location:string
    payment:number
    title:string
    category?:string[]
    cover_image_URL:string
    id:string
}

export interface DetailProp{
    employer:EmployerDetailProps
    job:JobDetailProps
}

// reviewer

export interface Reviewer{
avatar:string
name:string
}

export interface Review{
    comment:string
    review:string
    rating:number
    created_at:string
    reviewer:Reviewer
}

// employer interface

export interface Employer{
    avatar:string
    bio:string
    email:string
    name:string
}