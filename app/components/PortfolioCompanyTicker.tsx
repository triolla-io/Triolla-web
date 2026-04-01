"use client";

/** Matches `.company_triker` from Triolla portfolio snapshots; needs `.show` for opacity in theme CSS. */
export function PortfolioCompanyTicker({ names }: { names: string[] }) {
  if (!names.length) return null;
  return (
    <div className="company_triker show">
      <ul>
        {names.map((name) => (
          <li key={name}>
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
