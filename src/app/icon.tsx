import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Next.js App Router favicon — generated with ImageResponse.
 * Matches the BrandMark SVG in Navbar.tsx.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#0e1018",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #1c1f2e",
        }}
      >
        {/* Map-pin silhouette */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pin fill */}
          <path
            d="M16 3C11.582 3 8 6.582 8 11C8 17.5 16 29 16 29C16 29 24 17.5 24 11C24 6.582 20.418 3 16 3Z"
            fill="#D90429"
            opacity="0.2"
          />
          {/* Pin stroke */}
          <path
            d="M16 3C11.582 3 8 6.582 8 11C8 17.5 16 29 16 29C16 29 24 17.5 24 11C24 6.582 20.418 3 16 3Z"
            stroke="#D90429"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Temple tier 3 (base) */}
          <rect x="12" y="14" width="8" height="2" rx="0.5" fill="#D90429" />
          {/* Temple tier 2 */}
          <rect x="13" y="11.5" width="6" height="1.8" rx="0.5" fill="#D90429" />
          {/* Temple tier 1 (top) */}
          <rect x="14" y="9.2" width="4" height="1.8" rx="0.5" fill="#D90429" />
          {/* Spire */}
          <line
            x1="16" y1="9" x2="16" y2="7"
            stroke="#D90429"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
