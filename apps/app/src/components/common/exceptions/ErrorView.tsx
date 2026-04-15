export default function ErrorView() {
  return (
    <div className="wrapper flex h-full flex-1 flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center pb-10">
        <p className="text-t-1 mb-2.5 text-center text-gray-900">
          앗 !
          <br />
          오류가 발생했어요
        </p>
        <p className="text-b-1 mb-6 text-gray-700">다시 시작해주세요</p>
      </div>
    </div>
  );
}
