import CtaButton from '@/components/common/buttons/CtaButton';
import TextInput from '@/components/common/inputs/TextInput';
import Banner from '@/components/pages/waiting/Banner';
import { ROUTES } from '@/constants/routes';
import { KEYS } from '@/constants/storage';
import { useNavigate } from 'react-router-dom';
import NoticeView from '../board/NoticeView';

interface Props {
  waitingNumber: number;
  boothName: string;
  name: string;
  phone: string;
  partySize: number;
  waitingListNumber: number;
  notice: string;
}

export default function JoinWaitlistFinish({
  waitingNumber,
  boothName,
  name,
  phone,
  partySize,
  waitingListNumber,
  notice,
}: Props) {
  const navigate = useNavigate();

  const handlePreview = () => {
    localStorage.setItem(KEYS.IS_PREVIEW, '1');
    navigate(ROUTES.MENU_BOARD);
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center gap-6 p-4">
        <Banner
          boothName={boothName}
          waitingListLength={waitingListNumber + 1}
          isFinishJoinWaitlist={true}
        />
        <NoticeView notice={notice} />
        <TextInput
          label="대기번호"
          placeholder="대기번호를 입력해주세요."
          limitHide
          value={waitingNumber}
          disabled
        />
        <TextInput
          label="예약자 이름"
          placeholder="예약하시는 분 이름을 입력해주세요."
          limitHide
          value={name}
          disabled
        />
        <TextInput
          label="전화번호"
          placeholder="예약자 연락처를 입력해주세요."
          limitHide
          value={phone}
          disabled
        />
        <TextInput
          label="입장 인원"
          placeholder="총 인원을 입력해주세요."
          type="number"
          limitHide
          value={partySize}
          disabled
        />
      </main>

      <footer className="fixed right-0 bottom-0 left-0 flex justify-end gap-2 p-4">
        <CtaButton
          text="메뉴판 미리보기"
          radius="_2xl"
          onClick={handlePreview}
        />
      </footer>
    </>
  );
}
