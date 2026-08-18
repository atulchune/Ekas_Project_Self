"use client";

import React, { useEffect, useRef, useState } from "react";
import "./oil-fluid.js";

interface OilFluidProps {
  palette?: string[];
  zIndex?: number;
  opacity?: number;
  blend?: React.CSSProperties["mixBlendMode"];
}

export default function OilFluid({
  palette,
  zIndex = 190,
  opacity = 0.95,
  blend = "multiply",
}: OilFluidProps) {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (palette && palette.length) el.setAttribute("palette", palette.join(","));
    el.setAttribute("z-index", String(zIndex));
    el.setAttribute("opacity", String(opacity));
    if (blend) el.setAttribute("blend", blend);
  }, [mounted, palette, zIndex, opacity, blend]);

  if (!mounted) return null;

  return (
    <oil-fluid
      ref={ref}
      aria-hidden="true"
      {...(palette && palette.length ? { palette: palette.join(",") } : {})}
      {...(zIndex !== undefined ? { "z-index": String(zIndex) } : {})}
      {...(opacity !== undefined ? { opacity: String(opacity) } : {})}
      {...(blend ? { blend } : {})}
    />
  );
}

// Add TypeScript support for the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oil-fluid": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        palette?: string;
        "z-index"?: string;
        opacity?: string;
        blend?: string;
      };
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        "oil-fluid": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          palette?: string;
          "z-index"?: string;
          opacity?: string;
          blend?: string;
        };
      }
    }
  }
}
