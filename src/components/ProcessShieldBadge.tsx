interface Props {
  size?: number;
  className?: string;
}

/** Ícone "Gestão & Processos" da identidade da marca: escudo com check, em anel dourado. */
const ProcessShieldBadge = ({ size = 64, className = '' }: Props) => (
  <span
    className={`inline-flex items-center justify-center rounded-full ${className}`}
    style={{
      width: size,
      height: size,
      border: '1.5px solid #C9AF7D',
      backgroundColor: 'rgba(201, 175, 125, 0.14)',
    }}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 24 24"
      width={size * 0.47}
      height={size * 0.47}
      fill="none"
      stroke="#C9AF7D"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l7 3.2v5.3c0 4.6-3 8.2-7 9.5-4-1.3-7-4.9-7-9.5V6.2L12 3z" />
      <path d="M9.2 12l2 2 3.6-4" />
    </svg>
  </span>
);

export default ProcessShieldBadge;
