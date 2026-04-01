/**
 * Injects JSON-LD structured data schemas into the page head
 * Used for rich snippets in search engines
 */

import { getAllSchemas, serializeSchema } from "./lib/schema";

export function JsonLdSchemas() {
  const schemas = getAllSchemas();

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeSchema(schema),
          }}
          suppressHydrationWarning
        />
      ))}
    </>
  );
}
