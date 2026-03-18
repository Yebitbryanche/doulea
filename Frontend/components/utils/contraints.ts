  export const checkEmail = (email:string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // email check
  }
   
  export const passwordCheck = (password:string) =>{
    return/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password) // password check
  }

  export const phonecheck = (phone:string) =>{
    return /^6[0-9]{8}$/.test(phone) // phone check
  }

  export const timeAgo = (date: string) => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);
  const weeks = Math.floor(seconds / 604800);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
};