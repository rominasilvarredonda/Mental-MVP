export function Logo({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return <div className={`logo${dark ? " logo-dark" : ""}`}><img src="/assets/mental-logo.png" alt="Logo Mental" />{!compact && "mental"}</div>;
}
