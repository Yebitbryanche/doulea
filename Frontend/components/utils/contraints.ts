  export const checkEmail = (email:string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // email check
  }
   
  export const passwordCheck = (password:string) =>{
    return/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password) // password check
  }

  export const phonecheck = (phone:string) =>{
    return /^6[0-9]{8}$/.test(phone) // phone check
  }