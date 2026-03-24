import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | ApplyFlow",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-50 font-body overflow-x-hidden">
      <div className="w-full max-w-screen-2xl mx-auto">{children}</div>
    </div>
  );
}
