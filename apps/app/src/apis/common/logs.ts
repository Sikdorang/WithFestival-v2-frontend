import axiosInstance from '../';

export interface LogRequestDto {
  identifier: string;
  action: string;
  storeId?: number;
}

export const createLog = async (data: LogRequestDto): Promise<void> => {
  return axiosInstance.post('/logs', data);
};
