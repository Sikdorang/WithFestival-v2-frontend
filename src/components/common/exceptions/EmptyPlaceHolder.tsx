interface Props {
  image: React.ReactNode;
  text: string;
  textClassName?: string;
}

export default function EmptyPlaceHolder({
  image,
  text,
  textClassName = 'text-white',
}: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-15 text-center">
      <div className="flex w-full flex-col items-center gap-4 px-8">
        {image}
        <div className={`text-st-2 text-gray-500-50 mb-2`}>{text}</div>
      </div>
    </div>
  );
}
