"use client";

import { ServicePrototyping } from "@/app/components/ServicePrototyping";

export default function ServicePrototypingDemoPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#000",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ color: "#888", fontSize: "14px" }}>🌐 Services Page (English) Demo</span>
        </div>
        <div style={{ color: "#fff", fontSize: "16px" }}>
          Services Prototyping - English Version
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px", backgroundColor: "#fff", color: "#000" }}>
        <h1 style={{ marginBottom: "20px", color: "#000" }}>Service Prototyping Page (English) - Pure React Conversion</h1>

        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "40px",
            borderLeft: "4px solid #0066cc",
          }}
        >
          <h2 style={{ color: "#000" }}>About this demo:</h2>
          <ul style={{ color: "#333" }}>
            <li>✅ <strong>Real HTML-to-React conversion</strong> - Extracted from services-prototyping-body.html</li>
            <li>✅ <strong>LTR layout</strong> - Default left-to-right reading direction for English</li>
            <li>✅ <strong>Asset path templating</strong> - Uses assetBase prop for flexible asset loading</li>
            <li>✅ <strong>Scroll animations</strong> - IntersectionObserver + .show class pattern (matching Triolla theme)</li>
            <li>✅ <strong>Mobile responsive</strong> - CSS media queries in globals.css handle responsive behavior</li>
            <li>✅ <strong>Pure React</strong> - No HTML injection, no guessing - extracted exact structure</li>
          </ul>
        </div>

        <div style={{ marginBottom: "40px", fontSize: "14px", color: "#666", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
          <strong>Component Details:</strong>
          <br />• Source: <code style={{ color: "#d63384" }}>services-prototyping-body.html</code>
          <br />• Component: <code style={{ color: "#d63384" }}>ServicePrototyping.tsx</code>
          <br />• Asset paths: <code style={{ color: "#d63384" }}>/assets/services-prototyping/</code> and <code style={{ color: "#d63384" }}>/assets/_shared/</code>
        </div>
      </main>

      {/* Service Component - Exact React conversion of English services page */}
      <div style={{
        backgroundColor: "#1a1a1a",
        padding: "60px 40px",
        color: "#fff",
        minHeight: "500px"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", color: "#fff" }}>
          <ServicePrototyping assetBase="/assets/services-prototyping" />
        </div>
      </div>

      {/* Footer spacing */}
      <footer
        style={{
          backgroundColor: "#000",
          padding: "40px",
          color: "#888",
          textAlign: "center",
          fontSize: "14px",
          borderTop: "1px solid #333"
        }}
      >
        <p>
          This is a real HTML-to-React conversion demonstrating the pattern established in Footer.tsx and Footer.he.tsx
        </p>
        <p style={{ marginTop: "10px", fontSize: "12px" }}>
          Component: ServicePrototyping.tsx | HTML source: services-prototyping-body.html
        </p>
      </footer>
    </div>
  );
}
