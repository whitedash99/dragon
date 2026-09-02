import { WorkspaceShell } from "@/components/layout/WorkspaceShell";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
