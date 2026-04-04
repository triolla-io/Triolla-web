import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { absoluteUrl, breadcrumbListJsonLd, type BreadcrumbItem } from "../lib/structured-data";

export type BreadcrumbCrumb = { name: string; href: string };

type Props = {
  items: BreadcrumbCrumb[];
  visuallyHidden?: boolean;
  ariaLabel: string;
};

export function Breadcrumbs({ items, visuallyHidden = true, ariaLabel }: Props) {
  const jsonItems: BreadcrumbItem[] = items.map((c) => ({
    name: c.name,
    url: absoluteUrl(c.href),
  }));

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(jsonItems)} />
      <nav aria-label={ariaLabel} className={visuallyHidden ? "sr-only" : undefined}>
        <ol className="m-0 list-none p-0">
          {items.map((c, i) => (
            <li key={c.href} className="inline">
              {i > 0 ? <span aria-hidden="true"> / </span> : null}
              {i === items.length - 1 ? (
                <span>{c.name}</span>
              ) : (
                <Link href={c.href}>{c.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
