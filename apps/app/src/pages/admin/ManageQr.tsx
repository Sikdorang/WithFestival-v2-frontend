import { storeAPI } from '@/apis/store';
import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import TextInput from '@/components/common/inputs/TextInput';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import { encodeAccessPayload } from '@/utils/crypto';
import { toPng } from 'html-to-image';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DOMAIN = 'https://app.withfestival.site';

type QrType = 'table' | 'booth';

export default function ManageQr() {
  const navigate = useNavigate();
  const qrRef = useRef<HTMLDivElement>(null);
  const captureAreaRef = useRef<HTMLDivElement>(null);

  const [qrType, setQrType] = useState<QrType>('table');
  const [tableNum, setTableNum] = useState<string>('');
  const [userId, setUserId] = useState<string>('0');
  const [qrImgSrc, setQrImgSrc] = useState<string>('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await storeAPI.getStoreMyInfo();
        setUserId(String(response.id));
      } catch (error) {
        console.error('유저 정보를 가져오는데 실패했습니다.', error);
      }
    };

    fetchUserInfo();
  }, []);

  const { finalQrUrl } = useMemo(() => {
    const data: { userId: string; tableId?: number } = { userId };

    if (qrType === 'table') {
      const num = Number(tableNum);

      if (!isNaN(num) && num > 0) {
        data.tableId = num;
      }
    }

    const encodedPayload = encodeAccessPayload(data);
    const encoded = encodedPayload ? encodeURIComponent(encodedPayload) : '';

    return {
      finalQrUrl: `${DOMAIN}/check/${encoded}`,
      currentTableId: qrType === 'table' ? tableNum : 'booth',
    };
  }, [qrType, tableNum, userId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (qrRef.current) {
        const canvas = qrRef.current.querySelector('canvas');
        if (canvas) {
          setQrImgSrc(canvas.toDataURL('image/png'));
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [finalQrUrl]);

  const handleDownload = async () => {
    if (userId === '0') {
      alert('부스 정보를 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    if (!captureAreaRef.current) return;

    try {
      const captureOptions = {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#f9fafb',
        filter: (node: HTMLElement | Node) => {
          if (node instanceof HTMLElement) {
            if (node.id === 'hide-on-capture') return false;

            if (node.id === 'hidden-canvas-container') return false;
          }
          return true;
        },
      };

      await toPng(captureAreaRef.current, captureOptions);

      const dataUrl = await toPng(captureAreaRef.current, captureOptions);

      const fileName =
        qrType === 'table' ? `테이블_${tableNum}번_QR.png` : `부스_QR.png`;

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.click();
    } catch (err) {
      console.error('QR 다운로드 실패:', err);
      alert('이미지 저장에 실패했습니다.');
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
              onChange={(e) => {
                setQrType(e.target.value as QrType);
                setTableNum('');
              }}
              className="focus:border-primary-300 w-full rounded-xl border-2 border-gray-100 p-4 text-gray-800 outline-none"
            >
              <option value="table">테이블 QR</option>
              <option value="booth">부스 QR</option>
            </select>
          </div>

          {qrType === 'table' && (
            <TextInput
              type="number"
              label="테이블 번호"
              placeholder="테이블 번호를 입력하세요"
              value={tableNum}
              onChange={(e) => setTableNum(e.target.value)}
              limitHide
            />
          )}

          <div className="flex w-full justify-center">
            <div
              ref={captureAreaRef}
              className="flex w-fit min-w-[320px] flex-col items-center gap-5 rounded-[2rem] border border-gray-100 bg-gray-50 px-8 py-12"
            >
              <div className="text-center">
                <h3 className="text-gray-500-90 text-2xl font-black">
                  {qrType === 'table'
                    ? tableNum
                      ? `테이블 ${tableNum}`
                      : '테이블을 선택해주세요'
                    : '부스 QR'}
                </h3>
                {tableNum ? (
                  <p className="text-gray-500-80 mt-1 text-sm font-medium">
                    QR을 스캔하여 주문해주세요 !
                  </p>
                ) : undefined}

                {qrType === 'booth' && (
                  <p className="text-gray-500-80 mt-1 text-sm font-medium">
                    웨이팅 • 포장 주문 • 메뉴 보기
                  </p>
                )}
              </div>

              <div
                ref={qrRef}
                className="flex aspect-square items-center justify-center rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div
                  id="hidden-canvas-container"
                  className="pointer-events-none absolute opacity-0"
                >
                  <QRCodeCanvas
                    value={finalQrUrl}
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                {qrImgSrc ? (
                  <img src={qrImgSrc} alt="QR Code" width={200} height={200} />
                ) : (
                  <div className="h-[200px] w-[200px]" />
                )}
              </div>
              <div
                id="hide-on-capture"
                className="flex flex-col items-center gap-2"
              >
                <span className="bg-primary-100 text-primary-300 rounded-full px-3 py-1 text-[10px] font-bold">
                  {qrType.toUpperCase()} MODE
                </span>
                <p className="max-w-[250px] text-center text-[10px] break-all text-gray-400">
                  {finalQrUrl}
                </p>
              </div>
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
