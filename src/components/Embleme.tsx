export default function Embleme({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 132"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="60" y1="20" x2="60" y2="11" />
      <circle cx="60" cy="7" r="3.4" fill="currentColor" stroke="none" />
      <rect x="36" y="20" width="48" height="46" rx="13" />
      <rect x="45" y="32" width="30" height="16" rx="8" />
      <circle cx="54" cy="40" r="2.7" fill="currentColor" stroke="none" />
      <circle cx="66" cy="40" r="2.7" fill="currentColor" stroke="none" />
      <line x1="53" y1="66" x2="53" y2="73" />
      <line x1="67" y1="66" x2="67" y2="73" />
      <path d="M22 124 C22 96 38 78 60 78 C82 78 98 96 98 124" />
      <circle cx="60" cy="103" r="8" />
    </svg>
  );
}
