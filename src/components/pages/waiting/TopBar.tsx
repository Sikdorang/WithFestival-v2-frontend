interface Props {
  title: string;
  value: number;
}

export default function TopBar({ title, value }: Props) {
  return (
    <header className="bg-white p-4">
      <h1 className="text-st-2 flex gap-2 text-black">
        <div>{title}</div>
        <span className="text-primary-300">{value}</span>
      </h1>
    </header>
  );
}
