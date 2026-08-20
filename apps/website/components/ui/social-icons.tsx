import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

export function WhatsAppIcon({ className = "size-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      {...props}
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

export function ThreadsIcon({ className = "size-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.8 0 5.34-1.15 7.18-3.01l-1.44-1.44C16.27 19.02 14.24 20 12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8c4.08 0 7.44 3.06 7.93 7.02.05.41.07.82.07 1.23 0 1.95-.69 3.5-1.95 4.37-.87.6-1.98.81-3.05.58-.69-.15-1.3-.49-1.74-.99-.54-.62-.83-1.48-.83-2.43 0-1.85 1.09-3.23 2.76-3.48.51-.08 1.04-.04 1.55.1v-.64c0-1.47-.93-2.36-2.48-2.36-1.13 0-2.14.51-2.67 1.34l-1.63-1.15C10.5 4.19 12.06 3.5 13.76 3.5c2.72 0 4.48 1.63 4.48 4.36v6.24c0 .53.11.96.34 1.28.28.39.73.6 1.26.6.61 0 1.15-.24 1.57-.69.64-.68.99-1.67.99-2.79 0-.46-.03-.92-.08-1.38C21.71 5.92 17.3 2 12 2zm.24 12.55c-.79 0-1.39-.56-1.39-1.35 0-.82.6-1.38 1.39-1.38.31 0 .61.07.88.2.03.11.05.23.05.36v.83c-.26.85-.64 1.34-.93 1.34z"/>
    </svg>
  );
}

export function XIcon({ className = "size-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
