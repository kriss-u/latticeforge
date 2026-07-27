interface LogoProps {
  size?: number
}

export default function Logo({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 4 L26.5 10 V22 L16 28 L5.5 22 V10 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 4 V16 M26.5 10 L16 16 L5.5 10 M16 16 V28 M5.5 22 L16 16 L26.5 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.55"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2.4" fill="#34c2b6" />
    </svg>
  )
}
