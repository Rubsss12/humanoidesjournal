import EnTete from "@/components/EnTete";
import PiedDePage from "@/components/PiedDePage";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <EnTete />
      <main className="flex-1">{children}</main>
      <PiedDePage />
    </div>
  );
}
