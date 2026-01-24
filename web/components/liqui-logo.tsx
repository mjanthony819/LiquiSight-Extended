'use client'

interface LiquiLogoProps {
  className?: string
  size?: number
}

export function LiquiLogo({ className = "", size = 24 }: LiquiLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer rounded parallelogram */}
      <path
        d="M20 15 L80 15 C88 15 92 22 90 30 L75 78 C72 88 65 92 55 92 L20 92 C10 92 5 85 8 75 L23 27 C26 17 14 15 20 15 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Inner cutout - creates the hollow effect */}
      <path
        d="M30 28 L65 28 C70 28 73 32 71 38 L60 72 C58 78 53 82 47 82 L28 82 C22 82 19 78 21 72 L34 38 C36 32 28 28 30 28 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
      />
    </svg>
  )
}

// Alternative simpler version that matches the image better
export function LiquiLogoSimple({ className = "", size = 24 }: LiquiLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="20"
        ry="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        transform="skewX(-10)"
      />
    </svg>
  )
}

// Clean version matching the exact logo
export function LiquiLogoIcon({ className = "", size = 24 }: LiquiLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8 12C8 8.68629 10.6863 6 14 6H34C37.3137 6 40 8.68629 40 12V36C40 39.3137 37.3137 42 34 42H14C10.6863 42 8 39.3137 8 36V12Z"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        transform="skewX(-8)"
      />
    </svg>
  )
}
