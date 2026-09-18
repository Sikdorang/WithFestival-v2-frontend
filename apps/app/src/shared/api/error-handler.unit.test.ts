import { ERROR_MESSAGES } from '@/constants/message';
import { handelError } from '@/apis/errorhandler';
import axios from 'axios';
import { toast } from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('shared/api/error-handler (unit)', () => {
  it('shows session toast on 401', () => {
    const error = new axios.AxiosError('unauthorized');
    error.response = {
      status: 401,
      data: {},
      statusText: 'Unauthorized',
      headers: {},
      config: { headers: {} as never },
    };

    handelError(error);

    expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGES.sessionRequired);
  });

  it('shows server toast on 500', () => {
    const error = new axios.AxiosError('server');
    error.response = {
      status: 500,
      data: {},
      statusText: 'Error',
      headers: {},
      config: { headers: {} as never },
    };

    handelError(error);

    expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGES.serverError);
  });

  it('shows unexpected toast on other axios errors', () => {
    const error = new axios.AxiosError('bad request');
    error.response = {
      status: 400,
      data: {},
      statusText: 'Bad Request',
      headers: {},
      config: { headers: {} as never },
    };

    handelError(error);

    expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGES.unexpectedError);
  });

  it('ignores non-axios errors', () => {
    handelError(new Error('boom'));
    expect(toast.error).not.toHaveBeenCalled();
  });
});
