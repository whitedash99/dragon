import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 90,
          background: "linear-gradient(135deg, #040814 0%, #071126 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          border: "4px solid #00f0ff",
          boxShadow: "0 0 25px rgba(0, 240, 255, 0.6)",
        }}
      >
        <svg
          width="130"
          height="130"
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 64 22 L 84 34 L 110 24 L 94 48 L 116 52 L 88 66 L 78 56 L 64 62 Z"
            fill="#38bdf8"
          />
          <path d="M 48 34 L 64 22 L 66 42 L 52 46 Z" fill="#00f0ff" />
          <path d="M 34 46 L 48 36 L 50 54 L 36 58 Z" fill="#38bdf8" />
          <path
            d="M 54 50 L 78 52 L 88 68 L 74 76 L 52 68 Z"
            fill="#2563eb"
            stroke="#00f0ff"
            strokeWidth="2"
          />
          <path
            d="M 54 62 L 74 72 L 64 84 L 28 84 L 20 74 L 42 68 Z"
            fill="#00f0ff"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <polygon points="26,82 32,94 38,83" fill="#ffffff" />
          <polygon points="40,83 45,92 50,83" fill="#ffffff" />
          <path
            d="M 32 94 L 62 92 L 74 102 L 60 114 L 42 108 L 28 98 Z"
            fill="#2563eb"
            stroke="#00f0ff"
            strokeWidth="2"
          />
          <polygon points="30,96 34,88 38,95" fill="#ffffff" />
          <path
            d="M 62 94 L 88 84 L 98 100 L 78 116 L 60 114 Z"
            fill="#0f172a"
            stroke="#2563eb"
            strokeWidth="2"
          />
          <polygon points="56,66 68,68 64,74 54,70" fill="#00f0ff" />
          <polygon points="59,67 63,68 62,73 58,72" fill="#ffffff" />
          <path d="M 68 68 L 84 62 L 78 67 Z" fill="#00f0ff" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
