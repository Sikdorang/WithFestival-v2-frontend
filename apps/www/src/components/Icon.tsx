type IconProps = {
  name: string;
  size?: number;
  weight?: 300 | 400 | 500 | 600 | 700;
  filled?: boolean;
  className?: string;
};

export default function Icon({
  name,
  size = 20,
  weight = 400,
  filled = false,
  className = "",
}: IconProps) {
  return (
    <span
      aria-hidden
      className={`material-symbols-rounded select-none leading-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  );
}
