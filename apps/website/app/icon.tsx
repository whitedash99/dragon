export const dynamic = "force-static";

export default function Icon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="32" height="32">
    <rect width="128" height="128" rx="24" fill="#02050f" stroke="#00f0ff" stroke-width="4"/>
    <path d="M 20 42 L 10 68 L 26 88 L 38 78 L 28 56 Z" fill="#0f172a" stroke="#00f0ff" stroke-width="2" />
    <path d="M 108 42 L 118 68 L 102 88 L 90 78 L 100 56 Z" fill="#0f172a" stroke="#00f0ff" stroke-width="2" />
    <path d="M 52 44 L 20 12 L 36 38 L 46 54 Z" fill="#67e8f9" stroke="#00f0ff" stroke-width="2" />
    <path d="M 76 44 L 108 12 L 92 38 L 82 54 Z" fill="#67e8f9" stroke="#00f0ff" stroke-width="2" />
    <polygon points="64,14 71,36 64,46 57,36" fill="#ffffff" stroke="#00f0ff" stroke-width="2" />
    <polygon points="52,24 57,38 48,42" fill="#00f0ff" />
    <polygon points="76,24 71,38 80,42" fill="#00f0ff" />
    <polygon points="64,44 76,56 64,70 52,56" fill="#1e3a8a" stroke="#00f0ff" stroke-width="2" />
    <polygon points="40,58 52,61 48,67 38,63" fill="#00f0ff" />
    <polygon points="88,58 76,61 80,67 90,63" fill="#00f0ff" />
    <polygon points="56,66 72,66 76,82 64,90 52,82" fill="#38bdf8" stroke="#00f0ff" stroke-width="2" />
    <polygon points="53,82 56,94 60,84" fill="#ffffff" />
    <polygon points="68,84 72,94 75,82" fill="#ffffff" />
    <polygon points="50,92 64,116 78,92 64,100" fill="#0f172a" stroke="#00f0ff" stroke-width="2" />
    <polygon points="38,88 48,104 52,94" fill="#00f0ff" />
    <polygon points="90,88 80,104 76,94" fill="#00f0ff" />
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
