import { createContext, useContext, useState } from "react";
import apiClient from "../apiClient";

interface LikeProps {
  likedJobs: string[];
  toggleLike: (user_id: string | undefined, job_id: string) => Promise<void>;
  isLiked: (job_id: string) => boolean;
  unlike:(user_id:string | undefined, job_id:string | undefined) => Promise<void>
}

const LikeJobContext = createContext<LikeProps | undefined>(undefined);

export const LikeProvider = ({ children }: any) => {
  const [likedJobs, setLikedJobs] = useState<string[]>([]);


  const isLiked = (job_id: string) => likedJobs.includes(job_id);

  const toggleLike = async (user_id: string | undefined, job_id: string) => {
    if (!user_id) return;

    try {
      if (isLiked(job_id)) {
        await apiClient.delete(`/job/unlike_job/${user_id}/${job_id}`);

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


  const unlike = async (
    user_id: string | undefined,
    job_id: string | undefined
  ) => {
    if (!user_id || !job_id) return;

    try {
      await apiClient.delete(`/job/unlike_job/${user_id}/${job_id}`);

      // instantly update liked state
      setLikedJobs((prev) => prev.filter((id) => id !== job_id));

      console.log("removed from favorites");
    } catch (error: any) {
      console.error(error.response?.data);
    }
  };

  return (
    <LikeJobContext.Provider value={{ likedJobs, toggleLike, isLiked, unlike }}>
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