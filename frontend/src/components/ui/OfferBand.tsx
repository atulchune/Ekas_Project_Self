import React from "react";

/**
 * EKAS — Offer Band
 * ------------------------------------------------------------------
 * Slim promotional strip that sits directly BELOW the navbar.
 * Same construction on every page; only the copy changes per product.
 *
 * No dependencies, no CSS framework, no image assets — the botanical
 * clusters and background wave are inline SVG.
 *
 *   import OfferBand, { OFFERS } from "./OfferBand";
 *   <OfferBand {...OFFERS.coconut} />
 *
 * Fonts: Manrope 400/800.
 *   <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
 */

/* ---------------------------------------------------------------- tokens */

const C = {
  bandDark: "#1E3D1F",
  bandMid: "#2A5429",
  wave: "#1B3A1C",
  cream: "#F6F1E6",
  creamSoft: "rgba(240,234,220,.86)",
  rule: "rgba(233,223,203,.28)",
  gold: "#E8B93A",
  goldShadow: "#8A5F14",
  leaf: "#375F28",
  stem: "#3F6B2E",
  berry: "#C0453F",
};

/* ---------------------------------------------------------------- presets */

/** One entry per product / surface. Structure is identical — only words change. */
export const OFFERS = {
  home: {
    offerTitle: "18% OFF SITEWIDE",
    code: "BILONA18",
    badge: "Big Farm Drop",
    perkLabel: "Members enjoy",
    perkValue: "AN EXTRA 10%",
  },
  shop: {
    offerTitle: "12% OFF ALL OILS",
    code: "PRESS12",
    badge: "Harvest Drop",
    perkLabel: "Free shipping over",
    perkValue: "₹999",
  },
  coconut: {
    offerTitle: "15% OFF COCONUT OIL",
    code: "GHANI15",
    badge: "Press Week",
    perkLabel: "Subscribers save",
    perkValue: "A FURTHER 10%",
  },
  sesame: {
    offerTitle: "12% OFF SESAME OIL",
    code: "TIL12",
    badge: "Cold Press Days",
    perkLabel: "Subscribers save",
    perkValue: "A FURTHER 10%",
  },
  mustard: {
    offerTitle: "10% OFF MUSTARD OIL",
    code: "KACHI10",
    badge: "Pickle Season",
    perkLabel: "Buy 2, get",
    perkValue: "FREE SHIPPING",
  },
  groundnut: {
    offerTitle: "15% OFF GROUNDNUT OIL",
    code: "MOONG15",
    badge: "Farm Fresh",
    perkLabel: "Subscribers save",
    perkValue: "A FURTHER 10%",
  },
  almond: {
    offerTitle: "10% OFF ALMOND OIL",
    code: "BADAM10",
    badge: "Small Batch",
    perkLabel: "Limited to",
    perkValue: "40 BOTTLES",
  },
  ghee: {
    offerTitle: "12% OFF A2 BILONA GHEE",
    code: "BILONA12",
    badge: "Churn Week",
    perkLabel: "Subscribers save",
    perkValue: "A FURTHER 10%",
  },
};

/* ------------------------------------------------------- botanical corner */

function BotanicalCluster({ mirrored = false, extraBerry = true }: { mirrored?: boolean, extraBerry?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={
        mirrored
          ? { position: "absolute", right: -6, bottom: -10, opacity: 0.95, transform: "scaleX(-1)", lineHeight: 0 }
          : { position: "absolute", left: -6, top: -8, opacity: 0.95, lineHeight: 0 }
      }
    >
      <svg width="132" height="106" viewBox="0 0 132 106" fill="none">
        <path d="M2 96C22 62 50 44 86 38" stroke={C.stem} strokeWidth="2.4" strokeLinecap="round" />
        <g fill={C.leaf}>
          <path d="M10 84c4-13 12-21 24-25-3 12-10 20-24 25Z" />
          <path d="M28 66c6-12 15-18 27-20-5 11-13 17-27 20Z" />
          <path d="M50 52c8-9 17-13 29-13-7 9-16 13-29 13Z" />
          {extraBerry ? <path d="M14 92c-4-11-2-21 4-29 3 11 2 21-4 29Z" opacity=".85" /> : null}
        </g>
        <g fill={C.berry}>
          <circle cx="24" cy="58" r="5" />
          <circle cx="38" cy="46" r="4" />
          <circle cx="14" cy="70" r="4.2" />
          {extraBerry ? <circle cx="52" cy="36" r="3.6" /> : null}
        </g>
        <circle cx="24" cy="58" r="1.6" fill={C.gold} />
        {extraBerry ? <circle cx="38" cy="46" r="1.3" fill={C.gold} /> : null}
      </svg>
    </span>
  );
}

/* ---------------------------------------------------------------- band */

interface OfferBandProps {
  offerTitle?: string;
  code?: string;
  codeLabel?: string;
  badge?: string;
  perkLabel?: string;
  perkValue?: string;
  href?: string;
  onClick?: () => void;
}

export default function OfferBand({
  offerTitle = "18% OFF SITEWIDE",
  code = "BILONA18",
  codeLabel = "with code",
  badge = "Big Farm Drop",
  perkLabel = "Members enjoy",
  perkValue = "AN EXTRA 10%",
  href,
  onClick,
}: OfferBandProps) {
  const clickable = Boolean(href || onClick);

  const content = (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 90"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <path d="M0 62C210 30 430 78 640 52s380-40 560-14v52H0Z" fill={C.wave} opacity=".55" />
      </svg>

      <BotanicalCluster />
      <BotanicalCluster mirrored extraBerry={false} />

      <div
        style={{
          position: "relative",
          maxWidth: 1560,
          margin: "0 auto",
          padding: "14px clamp(20px, 4vw, 56px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(16px, 3vw, 46px)",
          flexWrap: "wrap",
          textAlign: "center",
        }}
      >
        <div style={{ color: C.cream }}>
          <div
            style={{
              fontSize: "clamp(14px, 1.35vw, 19px)",
              fontWeight: 800,
              letterSpacing: "-.01em",
              lineHeight: 1.15,
            }}
          >
            {offerTitle}
          </div>
          <div style={{ marginTop: 3, fontSize: "clamp(11.5px, 1vw, 13.5px)", fontWeight: 400, color: C.creamSoft }}>
            {codeLabel}{" "}
            <strong style={{ fontWeight: 800, color: C.cream, letterSpacing: ".04em" }}>{code}</strong>
          </div>
        </div>

        <span aria-hidden="true" style={{ width: 1, alignSelf: "stretch", minHeight: 34, background: C.rule }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span aria-hidden="true" style={{ color: C.gold, fontSize: 13 }}>◆</span>
          <span
            style={{
              fontSize: "clamp(16px, 1.7vw, 24px)",
              fontWeight: 800,
              letterSpacing: "-.02em",
              lineHeight: 1,
              color: C.gold,
              textTransform: "uppercase",
              textShadow: `0 2px 0 ${C.goldShadow}`,
            }}
          >
            {badge}
          </span>
          <span aria-hidden="true" style={{ color: C.gold, fontSize: 13 }}>◆</span>
        </div>

        <span aria-hidden="true" style={{ width: 1, alignSelf: "stretch", minHeight: 34, background: C.rule }} />

        <div style={{ color: C.cream }}>
          <div style={{ fontSize: "clamp(11.5px, 1vw, 13.5px)", fontWeight: 400, color: C.creamSoft, lineHeight: 1.2 }}>
            {perkLabel}
          </div>
          <div
            style={{
              marginTop: 3,
              fontSize: "clamp(14px, 1.35vw, 19px)",
              fontWeight: 800,
              letterSpacing: "-.01em",
            }}
          >
            {perkValue}
          </div>
        </div>
      </div>
    </>
  );

  const shell: React.CSSProperties = {
    position: "relative",
    display: "block",
    overflow: "hidden",
    background: C.bandMid,
    backgroundImage: `linear-gradient(100deg, ${C.bandDark} 0%, ${C.bandMid} 46%, ${C.bandDark} 100%)`,
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, sans-serif",
    textDecoration: "none",
    width: "100%",
    border: 0,
    cursor: clickable ? "pointer" : "default",
  };

  if (href) {
    return (
      <a href={href} aria-label={`${offerTitle} with code ${code}`} style={shell}>
        {content}
      </a>
    );
  }

  return (
    <aside aria-label="Current offer" onClick={onClick} style={shell}>
      {content}
    </aside>
  );
}
