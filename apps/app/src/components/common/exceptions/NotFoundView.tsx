export default function NotFoundView() {
  return (
    <div className="wrapper flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-6"></div>
        <p className="text-t-1 mb-2.5 text-center text-gray-900">
          찾으시는 페이지가
          <br />
          없어요
        </p>
        <p className="text-b-1 mb-6 text-center text-gray-700">
          잘못된 접근이거나 요청하신 페이지를
          <br /> 찾을 수 없습니다
        </p>
      </div>
    </div>
  );
}
