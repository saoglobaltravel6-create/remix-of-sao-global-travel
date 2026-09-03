type SplitTextProps = {
  text: string;
  delay?: number;
  className?: string;
  stagger?: number;
};

export function SplitText({ text, delay = 0, className, stagger = 0.035 }: SplitTextProps) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          aria-hidden="true"
          className="inline-block will-change-transform"
          style={{
            animation: "letterUp 0.85s var(--ease-spring) both",
            animationDelay: `${delay + i * stagger}s`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
