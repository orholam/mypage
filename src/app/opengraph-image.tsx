import { ImageResponse } from "next/og";

export const alt = "LaunchPage — waitlists and simple landing pages";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #f7f5f0 0%, #faf9f6 45%, #ede8ff 100%)",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <svg width="72" height="72" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#5B4FC9" />
            <path d="M6 24L14 8L18 16L26 24H6Z" fill="white" opacity="0.92" />
            <path d="M10 24L16 12L22 24H10Z" fill="#E8E4FF" />
          </svg>
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#1a1533",
            }}
          >
            LaunchPage
          </span>
        </div>
        <p
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: "#4a4466",
            maxWidth: 900,
            textAlign: "center",
            lineHeight: 1.35,
            margin: 0,
          }}
        >
          Waitlists and simple pages — collect signups from one dashboard.
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
