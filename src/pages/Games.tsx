import BulletImage from '@/assets/images/img_bullets.png';
import GunImage from '@/assets/images/img_gun.png';
import MagazineImage from '@/assets/images/img_magazine.png';
import TapAnimation from '@/assets/lotties/lottie_tap.json';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CtaButton from '../components/common/buttons/CtaButton';
import TextInput from '../components/common/inputs/TextInput';
import DeleteConfirmModal from '../components/common/modals/DeleteConfirmModal';

export default function Games() {
  const navigate = useNavigate();

  const [chamberCount, setChamberCount] = useState(6);
  const [bulletCount, setBulletCount] = useState(1);
  const [chambers, setChambers] = useState<boolean[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [isAnimationVisible, setIsAnimationVisible] = useState(true);
  const [setupStep, setSetupStep] = useState(1);

  const [bulletsFound, setBulletsFound] = useState(0);

  const bangSound = new Audio('/sounds/effect_gun_shot.mp3');
  const clickSound = new Audio('/sounds/effect_gun_tik.mp3');
  const reloadSound = new Audio('/sounds/effect_gun_reload.mp3');

  const handleGameStart = () => {
    if (bulletCount >= chamberCount) {
      alert('실탄은 총 약실 수보다 적어야 합니다!');
      return;
    }
    reloadSound.play();

    const newChambers = Array(chamberCount).fill(false);
    const chamberIndices = Array.from({ length: chamberCount }, (_, i) => i);
    for (let i = chamberIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chamberIndices[i], chamberIndices[j]] = [
        chamberIndices[j],
        chamberIndices[i],
      ];
    }
    for (let i = 0; i < bulletCount; i++) {
      const bulletPosition = chamberIndices[i];
      newChambers[bulletPosition] = true;
    }

    setChambers(newChambers);
    setCurrentIndex(0);
    setGameOver(false);
    setMessage('');
    setIsGameStarted(true);

    setBulletsFound(0);
  };

  const handleGunClick = () => {
    if (isAnimationVisible) {
      setIsAnimationVisible(false);
      return;
    }

    if (gameOver || currentIndex >= chamberCount) return;

    const hasBullet = chambers[currentIndex];

    if (hasBullet) {
      bangSound.play();
      const newBulletsFound = bulletsFound + 1;
      setBulletsFound(newBulletsFound);
      setMessage(`당첨 !`);

      if (newBulletsFound === bulletCount) {
        setMessage(`당첨 !`);
        setGameOver(true);
      } else {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    } else {
      clickSound.play();
      setMessage(`꽝 !`);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleReset = () => {
    setIsGameStarted(false);
    setMessage('');
    setSetupStep(1);
    setIsAnimationVisible(true);

    setBulletsFound(0);
  };

  const handleChamberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setChamberCount(Number(value));
    }
  };

  const handleChamberBlur = () => {
    let value = Number(chamberCount);
    if (isNaN(value) || value < 2) {
      value = 2;
    }
    if (value > 10) {
      value = 10;
    }
    setChamberCount(Number(value));
  };

  const handleBulletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setBulletCount(Number(value));
    }
  };

  const handleBulletBlur = () => {
    let value = Number(bulletCount);
    const maxBullet = Number(chamberCount) - 1;

    if (isNaN(value) || value < 1) {
      value = 1;
    }
    if (value > maxBullet) {
      value = maxBullet;
    }
    setBulletCount(Number(value));
  };

  useEffect(() => {
    if (!gameOver && isGameStarted && currentIndex === chamberCount) {
      setMessage('모든 기회를 소진했습니다!');
      setGameOver(true);
    }
  }, [currentIndex, chamberCount, gameOver, isGameStarted]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 text-center">
      {!isGameStarted ? (
        <div className="flex flex-col items-center gap-4">
          {setupStep === 1 && (
            <>
              <img src={MagazineImage} alt="magazine" className="w-1/2" />
              <label htmlFor="chamberInput" className="text-st-2">
                몇개의 탄창을 준비할까요 ?
              </label>
              <div className="text-c-1">
                이번 라운드에서 방아쇠를 당길 수 있는 횟수예요.
              </div>
              <TextInput
                id="chamberInput"
                type="number"
                min="2"
                max="20"
                placeholder="탄창 수를 입력해주세요."
                value={chamberCount}
                onChange={handleChamberChange}
                onBlur={handleChamberBlur}
                limitHide
              />
              <CtaButton
                text="다음으로"
                color="green"
                size="small"
                radius="_2xl"
                onClick={() => setSetupStep(2)}
              />
            </>
          )}

          {setupStep === 2 && (
            <>
              <img src={BulletImage} alt="bullet" className="w-1/2" />
              <label htmlFor="bulletInput" className="text-st-2">
                실탄 개수를 입력해주세요 !
              </label>
              <div className="text-c-1">
                입력한 실탄 수 만큼 벌칙자가 뽑혀요.
              </div>
              <TextInput
                id="bulletInput"
                type="number"
                min="1"
                max={chamberCount - 1}
                value={bulletCount}
                onChange={handleBulletChange}
                onBlur={handleBulletBlur}
                limitHide
              />
              <DeleteConfirmModal
                title={`더 즐거운 플레이를 위해 소리를 키워주세요 !`}
                description={'🥹 🔫'}
                cancelButtonText={'좀 쫄려요...'}
                confirmButtonText={'확인했어요!'}
                onConfirm={handleGameStart}
              >
                <CtaButton
                  text="게임 시작"
                  color="green"
                  size="small"
                  radius="_2xl"
                />
              </DeleteConfirmModal>
            </>
          )}
        </div>
      ) : (
        <div
          className={`flex h-full w-full flex-col items-center justify-center gap-4 ${
            message === '당첨 !'
              ? 'bg-gradient-to-b from-white to-[#20E988]'
              : ''
          }`}
          onClick={handleGunClick}
        >
          <div className="absolute top-9 right-6">
            <div className="mb-2 flex items-center gap-2">
              <div className="text-b-2 rounded-lg bg-black px-2 py-1 text-white">
                남은 턴
              </div>
              <div className="text-st-2">{chamberCount - currentIndex}</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-b-2 rounded-lg bg-black px-2 py-1 text-white">
                남은 실탄
              </div>
              <div className="text-st-2">{bulletCount - bulletsFound}</div>
            </div>
          </div>

          {isAnimationVisible && (
            <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Lottie
                animationData={TapAnimation}
                loop={true}
                style={{ width: 500, height: 500 }}
              />
            </div>
          )}

          <img
            src={GunImage}
            alt="game"
            className={`transition-transform duration-50 ${
              gameOver ? 'cursor-not-allowed' : 'cursor-pointer active:scale-97'
            }`}
          />
          <p className="h-8 text-2xl font-semibold">{message}</p>
          {gameOver && (
            <footer className="fixed right-0 bottom-0 left-0 flex justify-end gap-2 p-4">
              <div>
                <CtaButton
                  text="종료하기"
                  radius="xl"
                  onClick={() => navigate(-1)}
                  color="red"
                  width="fit"
                />
              </div>

              <div className="flex-1">
                <CtaButton
                  text="다시하기"
                  radius="xl"
                  color="white"
                  onClick={handleReset}
                />
              </div>
            </footer>
          )}
        </div>
      )}
    </div>
  );
}
