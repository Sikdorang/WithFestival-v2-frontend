import { BlindDateRequest, BlindDateResponse, datingAPI } from '@/apis/dating';
import { useCallback, useState } from 'react';

export const useDating = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [profiles, setProfiles] = useState<BlindDateResponse[]>([]);

  const createProfile = async (data: BlindDateRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await datingAPI.createBlindDate(data);
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await datingAPI.getBlindDates();
      setProfiles(response);
      return response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    profiles,
    createProfile,
    fetchProfiles,
  };
};
