import "../../globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="max-h-full overflow-auto">{children}</div>
    </div>
  );
}
