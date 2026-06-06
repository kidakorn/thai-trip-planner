import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — larger version of the brand mark */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "#0e1018",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 3C11.582 3 8 6.582 8 11C8 17.5 16 29 16 29C16 29 24 17.5 24 11C24 6.582 20.418 3 16 3Z"
            fill="#D90429"
            opacity="0.2"
          />
          <path
            d="M16 3C11.582 3 8 6.582 8 11C8 17.5 16 29 16 29C16 29 24 17.5 24 11C24 6.582 20.418 3 16 3Z"
            stroke="#D90429"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <rect x="12" y="14" width="8" height="2" rx="0.5" fill="#D90429" />
          <rect x="13" y="11.5" width="6" height="1.8" rx="0.5" fill="#D90429" />
          <rect x="14" y="9.2" width="4" height="1.8" rx="0.5" fill="#D90429" />
          <line x1="16" y1="9" x2="16" y2="7" stroke="#D90429" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
