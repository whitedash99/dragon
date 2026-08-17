import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Dynamic Icon Generator for Next.js App Router
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#02050f",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          border: "2px solid #00f0ff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Wings */}
          <path d="M 20 42 L 10 68 L 26 88 L 38 78 L 28 56 Z" fill="#0f172a" stroke="#00f0ff" strokeWidth="2" />
          <path d="M 108 42 L 118 68 L 102 88 L 90 78 L 100 56 Z" fill="#0f172a" stroke="#00f0ff" strokeWidth="2" />

          {/* Sweeping Horns */}
          <path d="M 52 44 L 20 12 L 36 38 L 46 54 Z" fill="#67e8f9" stroke="#00f0ff" strokeWidth="2" />
          <path d="M 76 44 L 108 12 L 92 38 L 82 54 Z" fill="#67e8f9" stroke="#00f0ff" strokeWidth="2" />

          {/* Crown */}
          <polygon points="64,14 71,36 64,46 57,36" fill="#ffffff" stroke="#00f0ff" strokeWidth="2" />
          <polygon points="52,24 57,38 48,42" fill="#00f0ff" />
          <polygon points="76,24 71,38 80,42" fill="#00f0ff" />

          {/* Forehead */}
          <polygon points="64,44 76,56 64,70 52,56" fill="#1e3a8a" stroke="#00f0ff" strokeWidth="2" />

          {/* Eyes */}
          <polygon points="40,58 52,61 48,67 38,63" fill="#00f0ff" />
          <polygon points="88,58 76,61 80,67 90,63" fill="#00f0ff" />

          {/* Snout */}
          <polygon points="56,66 72,66 76,82 64,90 52,82" fill="#38bdf8" stroke="#00f0ff" strokeWidth="2" />

          {/* Fangs */}
          <polygon points="53,82 56,94 60,84" fill="#ffffff" />
          <polygon points="68,84 72,94 75,82" fill="#ffffff" />

          {/* Mandible */}
          <polygon points="50,92 64,116 78,92 64,100" fill="#0f172a" stroke="#00f0ff" strokeWidth="2" />
          <polygon points="38,88 48,104 52,94" fill="#00f0ff" />
          <polygon points="90,88 80,104 76,94" fill="#00f0ff" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
