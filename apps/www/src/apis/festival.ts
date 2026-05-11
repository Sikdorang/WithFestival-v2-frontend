import { type FestivalEvent } from "@/src/data/schedule";
import axiosInstance from "./index";

export interface RawFestival {
  id: string;
  university: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
}

export const festivalAPI = {
  // 축제 목록 조회
  getFestivals: async () => {
    const response = await axiosInstance.get<RawFestival[]>("/festivals");
    return response.data;
  },

  // 특정 축제 상세 조회
  getFestivalById: async (id: number) => {
    const response = await axiosInstance.get<FestivalEvent>(`/festivals/${id}`);
    return response.data;
  },
};
