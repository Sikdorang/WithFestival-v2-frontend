import Spinner from './Spinner';

export default function LoadingView() {
  return (
    <div className="wrapper flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-6">
          <Spinner className="border-primary-400 h-8 w-8" />
        </div>
        <p className="text-t-1 mb-2.5 text-center text-gray-900">
          잠시만
          <br />
          기다려주세요
        </p>
        <p className="text-b-1 mb-6 text-gray-700">거의 다 완료 했어요!</p>
      </div>
    </div>
  );
}
