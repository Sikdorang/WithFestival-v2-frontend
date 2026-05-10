import CheckAnimation from '@/assets/lotties/lottie_check.json';
import CtaButton from '@/components/common/buttons/CtaButton';
import { ROUTES } from '@/constants/routes';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';

export default function CompleteStep() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-35 text-center">
      <div className="flex w-full flex-col items-center px-8">
        <Lottie
          animationData={CheckAnimation}
          loop={false}
          style={{ width: 64, height: 64 }}
        />
        <div className="text-t-1 mb-1">주문이 완료됐어요</div>
        <div className="text-b-1">
          음식이 조리될 때 까지
          <br />
          잠시 기다려주세요 !
        </div>
      </div>
      <footer className="fixed right-0 bottom-0 left-0 z-10 flex flex-col items-center gap-4 bg-white p-4">
        <CtaButton
          text="홈으로 가기"
          color="yellow"
          onClick={() => navigate(ROUTES.MENU_BOARD)}
          radius="_2xl"
        />
      </footer>
    </div>
  );
}
