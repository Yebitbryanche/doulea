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

export interface TransactionTypes {
    amount:number;
    status:"completed" | "pending" | "failed";
    created_at:string;
    reference:string
}

export type Notifications_type={
    id:number,
    created_at:string,
    is_read:boolean,
    message:string,
    title:string,
    type:string,
    user_id:string
}