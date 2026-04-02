import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../apiClient";

interface LikeProps {
  likedJobs: string[];
  toggleLike: (user_id: string | undefined, job_id: string) => Promise<void>;
  isLiked: (job_id: string) => boolean;
}

const LikeJobContext = createContext<LikeProps | undefined>(undefined);

export const LikeProvider = ({ children }: any) => {
  const [likedJobs, setLikedJobs] = useState<string[]>([]);


  const isLiked = (job_id: string) => likedJobs.includes(job_id);

  const toggleLike = async (user_id: string | undefined, job_id: string) => {
    if (!user_id) return;

    try {
      if (isLiked(job_id)) {
        await apiClient.delete(`/job/unlike_job/${user_id}`, {
          params: { job_id },
        });

        setLikedJobs(prev => prev.filter(id => id !== job_id));
      } else {
        await apiClient.post(`/job/like_job/${user_id}`, {
          job_id,
        });

        setLikedJobs(prev => [...prev, job_id]);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <LikeJobContext.Provider value={{ likedJobs, toggleLike, isLiked }}>
      {children}
    </LikeJobContext.Provider>
  );
};

export const useLike = () => {
  const context = useContext(LikeJobContext);
  if (!context) {
    throw new Error("useLike must be used within LikeProvider");
  }
  return context;
};