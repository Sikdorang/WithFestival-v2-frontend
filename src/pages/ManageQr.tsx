import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import TextInput from '@/components/common/inputs/TextInput';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import { encryptJson } from '@/utils/crypto';
import { QRCodeCanvas } from 'qrcode.react';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CtaButton from '../components/common/buttons/CtaButton';
import BottomSpace from '../components/common/exceptions/BottomSpace';

const DOMAIN = 'https://withfestival.com';

type QrType = 'table' | 'waiting' | 'takeout';

export default function ManageQr() {
  const navigate = useNavigate();
  const qrRef = useRef<HTMLDivElement>(null);

  const [qrType, setQrType] = useState<QrType>('table');
  const [tableNum, setTableNum] = useState<string>('');

  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const userId = userData.userId || '0';

  const { finalQrUrl, currentTableId } = useMemo(() => {
    let tableId: string | number = tableNum;
    if (qrType === 'takeout') tableId = 0;
    else if (qrType === 'waiting') tableId = 'w';

    const data = { userId: userId, tableId: tableId };

    const encrypted = encryptJson(data);

    const encoded = encrypted ? encodeURIComponent(encrypted) : '';

    return {
      finalQrUrl: `${DOMAIN}/check/${encoded}`,
      currentTableId: tableId,
    };
  }, [qrType, tableNum, userId]);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr_${userId}_${currentTableId}.png`;
      link.click();
    }
  };

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title="QR 코드 관리"
      />

      <main className="flex flex-grow flex-col px-4 pt-5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="ml-1 text-sm font-bold text-gray-700">
              QR 유형 선택
            </label>
            <select
              value={qrType}
              onChange={(e) => setQrType(e.target.value as QrType)}
              className="focus:border-primary-300 w-full rounded-xl border-2 border-gray-100 p-4 text-gray-800 outline-none"
            >
              <option value="table">일반 테이블 QR</option>
              <option value="waiting">웨이팅 QR</option>
              <option value="takeout">포장 전용 QR</option>
            </select>
          </div>

          {qrType === 'table' && (
            <TextInput
              label="테이블 번호"
              placeholder="테이블 번호를 입력하세요"
              value={tableNum}
              onChange={(e) => setTableNum(e.target.value)}
              limitHide
            />
          )}

          <div className="flex flex-col items-center gap-5 rounded-[2rem] border border-gray-100 bg-gray-50 py-12">
            <div
              ref={qrRef}
              className="flex aspect-square items-center justify-center rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <QRCodeCanvas
                value={finalQrUrl}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="bg-primary-100 text-primary-300 rounded-full px-3 py-1 text-[10px] font-bold">
                {qrType.toUpperCase()} MODE
              </span>
              <p className="max-w-[250px] text-center text-[10px] break-all text-gray-400">
                {finalQrUrl}
              </p>
            </div>
          </div>
        </div>
        <BottomSpace />
      </main>

      <footer className="fixed right-0 bottom-0 left-0 flex gap-2 border-t border-gray-50 bg-white p-4">
        <CtaButton
          text="QR 이미지 저장"
          onClick={handleDownload}
          disabled={qrType === 'table' && !tableNum}
          className="flex-1"
        />
      </footer>
    </BaseResponsiveLayout>
  );
}
