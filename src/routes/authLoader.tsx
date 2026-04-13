import { redirect } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export const authLoader = async () => {
  try {
    // ✅ 스토어의 checkAuthStatus 액션을 직접 호출합니다.
    // (loader는 React 컴포넌트가 아니므로 .getState()를 사용합니다)
    const user = await useAuthStore.getState().checkAuthStatus();
    return user; // 성공 시 user 데이터를 라우트에 전달
  } catch (error) {
    // checkAuthStatus에서 에러를 던지면, 여기서 잡아서 리디렉션합니다.
    return redirect('/login');
  }
};
