import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import Navigator from '@/components/common/layouts/Navigator';
import ManageBoothItem from './ManageBoothItem';
import { useStore } from '@/hooks/useStore';
import { useEffect, useState } from 'react';

const boothManagementConfig = [
  {
    key: 'name',
    title: '부스 이름',
    placeholder: '부스 이름을 입력해주세요.',
    isTextArea: false,
  },
  {
    key: 'account',
    title: '계좌번호',
    placeholder: '계좌번호를 입력해주세요.',
    isTextArea: false,
  },
  {
    key: 'notice',
    title: '공지사항',
    placeholder: '공지사항을 입력해주세요.',
    isTextArea: true,
  },
  {
    key: 'event',
    title: '이벤트',
    placeholder: '이벤트를 입력해주세요.',
    isTextArea: true,
  },
];

interface Props {
  onClose: () => void;
}

export default function ManageBooth({ onClose }: Props) {
  const {
    updateStoreName,
    updateStoreAccount,
    getUserInfo,
    account,
    name,
    notice,
    event,
    updateStoreNotice,
    updateStoreEvent,
  } = useStore();

  const [inputs, setInputs] = useState({
    name: '',
    account: '',
    notice: '',
    event: '',
  });

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    setInputs({
      name: name || '',
      account: account || '',
      notice: notice || '',
      event: event || '',
    });
  }, [name, account, notice, event]);

  const handleSave = (key: keyof typeof inputs, newValue: string) => {
    switch (key) {
      case 'name':
        updateStoreName(newValue);
        break;
      case 'account':
        updateStoreAccount(newValue);
        break;
      case 'notice':
        updateStoreNotice(newValue);
        break;
      case 'event':
        updateStoreEvent(newValue);
        break;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Navigator
        left={<GoBackIcon />}
        center={<div className="text-st-1">부스 관리하기</div>}
        onLeftPress={onClose}
      />

      <main className="flex flex-grow flex-col gap-3 p-4">
        {boothManagementConfig.map((item) => (
          <ManageBoothItem
            key={item.key}
            title={item.title}
            value={
              inputs[item.key as keyof typeof inputs] ||
              `등록된 ${item.title}이 없습니다.`
            }
            placeholder={item.placeholder}
            isTextArea={item.isTextArea}
            onSave={(newValue) =>
              handleSave(item.key as keyof typeof inputs, newValue)
            }
          />
        ))}
      </main>
    </div>
  );
}
