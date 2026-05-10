import { MissionCreateDTO, MissionUpdateDTO } from '@/types/payload/mission';
import axiosInstance from '.';

export const missionAPI = {
  createMission: async (data: MissionCreateDTO) => {
    const response = await axiosInstance.post('/missions', data);
    return response.data;
  },

  getMissions: async () => {
    const response = await axiosInstance.get('/missions');
    return response.data;
  },

  getMissionsByStoreId: async (storeId: number) => {
    const response = await axiosInstance.get(`/stores/${storeId}/missions`);
    return response.data;
  },

  getMissionById: async (id: number) => {
    const response = await axiosInstance.get(`/missions/${id}`);
    return response.data;
  },

  updateMission: async (id: number, data: MissionUpdateDTO) => {
    const response = await axiosInstance.patch(`/missions/${id}`, data);
    return response.data;
  },

  deleteMission: async (id: number) => {
    const response = await axiosInstance.delete(`/missions/${id}`);
    return response.data;
  },

  toggleMissionActive: async (id: number, isActive: boolean) => {
    const response = await axiosInstance.patch(`/missions/${id}/active`, {
      isActive,
    });
    return response.data;
  },
};
