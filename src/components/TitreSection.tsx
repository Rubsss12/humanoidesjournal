export default function TitreSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="font-sans text-[0.8rem] font-bold uppercase tracking-[0.18em] text-ink">
        {children}
      </h2>
      <span className="h-px flex-1 bg-rule" />
    </div>
  );
}
