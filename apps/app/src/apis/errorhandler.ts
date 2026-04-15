import { ERROR_MESSAGES } from '@/constants/message';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const handelError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 401) {
      toast.error(ERROR_MESSAGES.sessionRequired);
    } else if (status === 500) {
      toast.error(ERROR_MESSAGES.serverError);
    } else {
      toast.error(ERROR_MESSAGES.unexpectedError);
    }
  }
};
