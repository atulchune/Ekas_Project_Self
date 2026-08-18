"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* ---------------------------------------------------------------- tokens */

const C = {
  forest: "#1A3319",
  green: "#234826",
  olive: "#4C5B33",
  cream: "#F6F1E6",
  offWhite: "#FFFCF6",
  sand: "#EFE7D6",
  gold: "#B08D4F",
  goldDeep: "#7A5F28",
  ink: "#5E594C",
  muted: "#6A5F45",
};

/* ---------------------------------------------------------------- data */

const IMAGES = {
  groundnut: "/images/ekas/groundnut-oil.jpg",
  mustard: "/images/ekas/mustard-oil.jpg",
  coconut: "/images/ekas/coconut-oil.jpg",
  sesame: "/images/ekas/sesame-oil.jpg",
  almond: "/images/ekas/almond-oil.jpg",
  ghee: "/images/ekas/a2-bilona-ghee.jpg",
} as Record<string, string>;

export const COLLECTIONS = [
  { id: "groundnut", name: "Groundnut", tag: "New",         note: "Mild, buttery, high smoke point", price: "₹329", href: "/shop?search=groundnut" },
  { id: "mustard",   name: "Mustard",   tag: "",            note: "Sharp kachi ghani pungency",      price: "₹279", href: "/shop?search=mustard" },
  { id: "coconut",   name: "Coconut",   tag: "Loved",       note: "Sun-dried Kerala copra",          price: "₹299", href: "/shop?search=coconut" },
  { id: "sesame",    name: "Sesame",    tag: "",            note: "Nutty, warm, everyday tempering", price: "₹349", href: "/shop?search=sesame" },
  { id: "almond",    name: "Almond",    tag: "Small batch", note: "Delicate finishing oil",          price: "₹599", href: "/shop?search=almond" },
  { id: "ghee",      name: "Ghee",      tag: "",            note: "Hand-churned A2 bilona",          price: "₹849", href: "/shop?search=ghee" },
];

/* ------------------------------------------------- particle ring geometry */

const PARTICLE_COUNT = 12;

export const PARTICLE_ART: Record<string, ((s: number) => React.ReactNode)[]> = {
  groundnut: [
    (s) => (
      <svg viewBox="0 0 24 32" width={s} height={Math.round(s * 1.33)}>
        <path d="M12 1c4 0 6 3.4 6 6.4 0 2.2-1.3 3.4-1.3 4.9 0 1.6 1.8 2.8 1.8 5.6 0 4.4-2.8 8.1-6.5 8.1S5.5 22.3 5.5 17.9c0-2.8 1.8-4 1.8-5.6 0-1.5-1.3-2.7-1.3-4.9C6 4.4 8 1 12 1Z" fill="#C89A5E" />
        <path d="M9.4 6.6c.7-1.4 2-2.2 3.4-2" stroke="#A87C42" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        <path d="M8.6 17.4c.8-1.5 2.2-2.4 3.8-2.3" stroke="#A87C42" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
    (s) => (
      <svg viewBox="0 0 20 26" width={s} height={Math.round(s * 1.3)}>
        <ellipse cx="10" cy="13" rx="8" ry="12" fill="#9C5B33" />
        <path d="M10 2v22" stroke="#7A4526" strokeWidth="1" opacity=".7" />
      </svg>
    ),
    (s) => (
      <svg viewBox="0 0 24 24" width={s} height={s}>
        <path d="M12 22c0-7 3.4-11.2 9.6-12.4C20.6 16.8 16.8 20.8 12 22Z" fill="#5C7A3A" />
        <path d="M12 22c0-7-3.4-11.2-9.6-12.4C3.4 16.8 7.2 20.8 12 22Z" fill="#4C6B31" opacity=".8" />
      </svg>
    ),
  ],

  mustard: [
    (s) => (
      <svg viewBox="0 0 16 16" width={Math.round(s * 0.82)} height={Math.round(s * 0.82)}>
        <circle cx="8" cy="8" r="7" fill="#6B4A1E" />
        <circle cx="5.8" cy="5.8" r="2.2" fill="#8A6329" opacity=".85" />
      </svg>
    ),
    (s) => (
      <svg viewBox="0 0 16 16" width={Math.round(s * 0.7)} height={Math.round(s * 0.7)}>
        <circle cx="8" cy="8" r="7" fill="#3E2A11" />
      </svg>
    ),
    (s) => (
      <svg viewBox="0 0 24 24" width={Math.round(s * 1.15)} height={Math.round(s * 1.15)}>
        <g fill="#E8B93A">
          <ellipse cx="12" cy="5.6" rx="3.4" ry="4.6" />
          <ellipse cx="12" cy="18.4" rx="3.4" ry="4.6" />
          <ellipse cx="5.6" cy="12" rx="4.6" ry="3.4" />
          <ellipse cx="18.4" cy="12" rx="4.6" ry="3.4" />
        </g>
        <circle cx="12" cy="12" r="2.8" fill="#B8801C" />
      </svg>
    ),
  ],

  coconut: [
    (s) => (
      <svg viewBox="0 0 26 22" width={s} height={Math.round(s * 0.85)}>
        <path d="M3 6.5C6 2 20 2 23 6.5c1.6 2.4-1 13.4-10 13.4S1.4 8.9 3 6.5Z" fill="#F6EFE0" />
        <path d="M3 6.5C6 2 20 2 23 6.5c.5.8.5 2.3.1 4-3.4-2.6-16.8-2.6-20.2 0-.4-1.7-.4-3.2.1-4Z" fill="#6B4A2E" />
      </svg>
    ),
    (s) => (
      <svg viewBox="0 0 22 22" width={Math.round(s * 0.9)} height={Math.round(s * 0.9)}>
        <circle cx="11" cy="11" r="10" fill="#5A3A22" />
        <circle cx="8" cy="8" r="1.7" fill="#3B2413" />
        <circle cx="13.4" cy="8" r="1.7" fill="#3B2413" />
        <circle cx="10.7" cy="13" r="1.7" fill="#3B2413" />
      </svg>
    ),
    (s) => (
      <svg viewBox="0 0 34 20" width={Math.round(s * 1.7)} height={s}>
        <path d="M2 17C10 6 24 2 33 3" stroke="#3F6B2E" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <g fill="#4E7F37">
          <path d="M6 15c2-4 5-6 8-6.6-1.6 2.8-3.6 5-8 6.6Z" />
          <path d="M12 11.4c2.6-3.4 5.6-5 8.6-5.2-2 2.6-4.4 4.4-8.6 5.2Z" />
          <path d="M19 8c2.8-2.6 5.8-3.6 8.6-3.4-2.2 2.2-4.8 3.4-8.6 3.4Z" />
          <path d="M7 16.6c-.4-3 .4-5.6 1.8-7.6.6 3 .4 5.6-1.8 7.6Z" opacity=".8" />
        </g>
      </svg>
    ),
  ],

  sesame: [
    (s) => (
      <svg viewBox="0 0 14 20" width={Math.round(s * 0.72)} height={s}>
        <path d="M7 1c3.4 2.6 5 6 5 9.6C12 15.6 9.8 19 7 19S2 15.6 2 10.6C2 7 3.6 3.6 7 1Z" fill="#F2E4C6" />
        <path d="M7 1c1.4 1.1 2.5 2.4 3.2 3.8C9 4 8 3.6 7 3.6Z" fill="#D9C398" />
      </svg>
    ),
    (s) => (
      <svg viewBox="0 0 14 20" width={Math.round(s * 0.68)} height={Math.round(s * 0.94)}>
        <path d="M7 1c3.4 2.6 5 6 5 9.6C12 15.6 9.8 19 7 19S2 15.6 2 10.6C2 7 3.6 3.6 7 1Z" fill="#8A6B3C" />
      </svg>
    ),
    (s) => (
      <svg viewBox="0 0 22 24" width={Math.round(s * 1.05)} height={Math.round(s * 1.15)}>
        <path d="M11 23C4 19 1 13 3 4c8 0 16 6 16 12 0 3.4-3.4 6.2-8 7Z" fill="#4C6B31" />
        <path d="M11 23C7.4 17.6 5.4 11 3 4" stroke="#37501F" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
  ],

  almond: [
    (s) => (
      <svg viewBox="0 0 18 26" width={Math.round(s * 0.8)} height={Math.round(s * 1.15)}>
        <path d="M9 1c5 4.4 8 9.4 8 14.2C17 21 13.4 25 9 25S1 21 1 15.2C1 10.4 4 5.4 9 1Z" fill="#D8AE79" />
        <path d="M9 1c1.8 1.6 3.4 3.4 4.6 5.2C12 4.6 10.6 3.6 9 3.4Z" fill="#B98B52" />
      </svg>
    ),
    (s) => (
      <svg viewBox="0 0 18 26" width={Math.round(s * 0.76)} height={Math.round(s * 1.1)}>
        <path d="M9 1c5 4.4 8 9.4 8 14.2C17 21 13.4 25 9 25S1 21 1 15.2C1 10.4 4 5.4 9 1Z" fill="#8C5A32" />
      </svg>
    ),
    (s) => (
      <svg viewBox="0 0 24 24" width={Math.round(s * 1.15)} height={Math.round(s * 1.15)}>
        <g fill="#F3DCE2">
          <ellipse cx="12" cy="5.4" rx="3.6" ry="4.8" />
          <ellipse cx="12" cy="18.6" rx="3.6" ry="4.8" />
          <ellipse cx="5.4" cy="12" rx="4.8" ry="3.6" />
          <ellipse cx="18.6" cy="12" rx="4.8" ry="3.6" />
        </g>
        <circle cx="12" cy="12" r="2.6" fill="#C98CA0" />
      </svg>
    ),
  ],

  ghee: [
    (s) => (
      <svg viewBox="0 0 18 24" width={Math.round(s * 0.8)} height={Math.round(s * 1.05)}>
        <path d="M9 1c4.4 6 8 10 8 14.2A8 8 0 1 1 1 15.2C1 11 4.6 7 9 1Z" fill="#E8B443" />
        <path d="M5.4 15.6c0-2.2 1-4 2.6-5.2" stroke="#F6DFA6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    ),
    (s) => (
      <svg viewBox="0 0 18 24" width={Math.round(s * 0.68)} height={Math.round(s * 0.9)}>
        <path d="M9 1c4.4 6 8 10 8 14.2A8 8 0 1 1 1 15.2C1 11 4.6 7 9 1Z" fill="#C08A24" />
      </svg>
    ),
    (s) => (
      <svg viewBox="0 0 22 24" width={Math.round(s * 1.05)} height={Math.round(s * 1.15)}>
        <path d="M11 23c7-4 10-10 8-19-8 0-16 6-16 12 0 3.4 3.4 6.2 8 7Z" fill="#4E7F37" />
        <path d="M11 23c3.6-5.4 5.6-12 8-19" stroke="#37501F" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
  ],
};

function buildParticles(collectionId: string) {
  const art = PARTICLE_ART[collectionId] || PARTICLE_ART.sesame;
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const ring = i % 3;                              // 0 primary, 1 secondary, 2 foliage
    const distance = 88 + ring * 16;                 // kept inside the section's overflow
    const size = ring === 0 ? 14 : ring === 1 ? 10 : 7;
    return {
      key: i,
      dx: Math.round(Math.cos(angle) * distance),
      dy: Math.round(Math.sin(angle) * distance),
      rot: (i * 47) % 360,
      node: art[ring](size),
    };
  });
}

function Particle({ p }: { p: any }) {
  return (
    <span
      data-seed=""
      data-dx={p.dx}
      data-dy={p.dy}
      data-rot={p.rot}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        margin: "-7px 0 0 -7px",
        opacity: 0,
        transform: "translate3d(0,0,0) scale(.3)",
        willChange: "transform, opacity",
        pointerEvents: "none",
        lineHeight: 0,
      }}
    >
      {p.node}
    </span>
  );
}

/* ---------------------------------------------------------------- card */

function CollectionCard({ item, image, onSelect, calm }: { item: any; image: string; onSelect?: any; calm: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const particles = useMemo(() => buildParticles(item.id), [item.id]);

  const paint = useCallback(
    (on: boolean) => {
      const card = ref.current;
      if (!card) return;
      const q = (s: string) => card.querySelector(s) as HTMLElement;
      const animate = !calm;

      const disc = q("[data-disc]");
      if (disc) {
        disc.style.transform = on && animate ? "scale(1.07)" : "scale(1)";
        disc.style.boxShadow = on ? "0 26px 54px rgba(26,51,25,.24)" : "0 10px 26px rgba(26,51,25,.1)";
        disc.style.borderColor = on ? C.gold : "rgba(35,72,38,.5)";
      }

      const img = q("[data-img]");
      if (img) img.style.transform = on && animate ? "scale(1.16)" : "scale(1)";

      const arc = q("[data-arc]");
      if (arc) {
        arc.style.opacity = on ? "1" : "0";
        arc.style.transform = on ? "rotate(-90deg) scale(1)" : "rotate(-90deg) scale(.94)";
      }

      const halo = q("[data-halo]");
      if (halo) {
        halo.style.opacity = on ? "1" : "0";
        halo.style.transform = on ? "scale(1)" : "scale(.8)";
      }

      const veil = q("[data-veil]");
      if (veil) veil.style.opacity = on ? "1" : "0";

      const price = q("[data-price]");
      if (price) {
        price.style.opacity = on ? "1" : "0";
        price.style.transform = on ? "translateY(0)" : "translateY(10px)";
      }

      const note = q("[data-note]");
      if (note) {
        note.style.opacity = on ? "1" : "0";
        note.style.transform = on ? "translateY(0)" : "translateY(-5px)";
      }

      const name = q("[data-name]");
      if (name) {
        name.style.color = on ? C.green : C.forest;
        name.style.transform = on && animate ? "translateY(-2px)" : "translateY(0)";
      }

      card.querySelectorAll("[data-seed]").forEach((sdEl, i) => {
        const sd = sdEl as HTMLElement;
        if (!animate) {
          sd.style.opacity = "0";
          sd.style.transform = "translate3d(0,0,0) scale(.3)";
          return;
        }
        const dx = sd.getAttribute("data-dx");
        const dy = sd.getAttribute("data-dy");
        const rot = sd.getAttribute("data-rot");
        const delay = on ? i * 26 : (PARTICLE_COUNT - 1 - i) * 12;
        sd.style.transition =
          `opacity .5s ease ${delay}ms, transform ${on ? ".95s" : ".55s"} cubic-bezier(.16,1,.3,1) ${delay}ms`;
        sd.style.opacity = on ? "1" : "0";
        sd.style.transform = on
          ? `translate3d(${dx}px, ${dy}px, 0) rotate(${rot}deg) scale(1)`
          : "translate3d(0,0,0) rotate(0deg) scale(.3)";
      });
    },
    [calm]
  );

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onSelect?.(item)}
      onPointerEnter={() => paint(true)}
      onPointerLeave={() => paint(false)}
      onFocus={() => paint(true)}
      onBlur={() => paint(false)}
      aria-label={`${item.name} — ${item.note}`}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        padding: "12px 4px",
        background: "none",
        border: 0,
        cursor: "pointer",
        minWidth: 0,
        font: "inherit",
      }}
    >
      <span
        style={{
          position: "relative",
          display: "grid",
          placeItems: "center",
          width: "clamp(128px, 12.5vw, 178px)",
          aspectRatio: "1",
        }}
      >
        <span style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {particles.map((p) => (
            <Particle key={p.key} p={p} />
          ))}
        </span>

        <svg
          data-arc=""
          viewBox="0 0 200 200"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-9%",
            width: "118%",
            height: "118%",
            overflow: "visible",
            opacity: 0,
            transform: "rotate(-90deg) scale(.94)",
            transition: "opacity .5s ease, transform .7s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <circle
            cx="100" cy="100" r="94"
            fill="none" stroke={C.gold} strokeWidth="1.4" strokeLinecap="round"
            strokeDasharray="34 26"
            style={{ animation: "ekasDash 9s linear infinite" }}
          />
        </svg>

        <span
          data-halo=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-6%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(176,141,79,.3), transparent 68%)",
            opacity: 0,
            transform: "scale(.8)",
            transition: "opacity .55s ease, transform .7s cubic-bezier(.16,1,.3,1)",
          }}
        />

        <span
          data-disc=""
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            overflow: "hidden",
            background: C.sand,
            border: "1.5px solid rgba(35,72,38,.5)",
            boxShadow: "0 10px 26px rgba(26,51,25,.1)",
            transition:
              "transform .7s cubic-bezier(.16,1,.3,1), box-shadow .7s ease, border-color .5s ease",
          }}
        >
          <span
            data-img=""
            style={{
              position: "absolute",
              inset: 0,
              display: "block",
              transition: "transform 1.1s cubic-bezier(.16,1,.3,1)",
            }}
          >
            <Image
              src={image}
              alt={item.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </span>

          <span
            data-veil=""
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "linear-gradient(to top, rgba(16,32,14,.62), rgba(16,32,14,0) 62%)",
              opacity: 0,
              transition: "opacity .55s ease",
            }}
          />

          <span
            data-price=""
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "12%",
              textAlign: "center",
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: ".04em",
              color: C.cream,
              opacity: 0,
              transform: "translateY(10px)",
              transition:
                "opacity .5s ease .06s, transform .6s cubic-bezier(.16,1,.3,1) .06s",
            }}
          >
            from {item.price}
          </span>
        </span>

        {item.tag ? (
          <span
            style={{
              position: "absolute",
              top: -2,
              left: -6,
              zIndex: 3,
              padding: "6px 11px",
              borderRadius: 999,
              background: C.goldDeep,
              color: C.offWhite,
              fontSize: 8.5,
              fontWeight: 700,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              boxShadow: "0 6px 16px rgba(26,51,25,.22)",
            }}
          >
            {item.tag}
          </span>
        ) : null}
      </span>

      <span style={{ display: "block", textAlign: "center", minWidth: 0 }}>
        <span
          data-name=""
          style={{
            display: "block",
            fontSize: "clamp(15px, 1.25vw, 18px)",
            fontWeight: 700,
            letterSpacing: "-.022em",
            color: C.forest,
            transition: "color .4s ease, transform .6s cubic-bezier(.16,1,.3,1)",
          }}
        >
          {item.name}
        </span>
        <span
          data-note=""
          style={{
            display: "block",
            marginTop: 7,
            maxWidth: "19ch",
            fontSize: 11.5,
            lineHeight: 1.5,
            color: C.muted,
            fontWeight: 300,
            opacity: 0,
            transform: "translateY(-5px)",
            transition: "opacity .5s ease, transform .55s cubic-bezier(.16,1,.3,1)",
          }}
        >
          {item.note}
        </span>
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------- section */

export function OilCollections({
  items = COLLECTIONS,
  images = IMAGES,
  eyebrow = "Six presses, one promise",
  title = "Our Premium Collections",
  intro = "Every category starts as a seed or a nut someone in a village sorted by hand. Hover one to see what goes into it.",
  ctaLabel = "Shop all",
  ctaHref = "/shop",
  reduceMotion = false,
}: any) {
  const router = useRouter();
  const [systemCalm, setSystemCalm] = useState(false);
  const [cols, setCols] = useState(6);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSystemCalm(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    const sync = () => {
      const w = window.innerWidth;
      setCols(w >= 1065 ? 6 : w >= 620 ? 3 : 2);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const calm = reduceMotion || systemCalm;

  useEffect(() => {
    const nodes = [headerRef.current, gridRef.current].filter(Boolean) as HTMLElement[];
    if (calm || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => {
        n.style.opacity = "1";
        n.style.transform = "none";
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "none";
          io.unobserve(e.target);
        });
      },
      { threshold: 0.16 }
    );
    nodes.forEach((n) => io.observe(n));
    const failsafe = setTimeout(() => {
      nodes.forEach((n) => {
        n.style.opacity = "1";
        n.style.transform = "none";
      });
    }, 4000);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, [calm]);

  return (
    <section
      id="collections"
      style={{
        position: "relative",
        padding: "clamp(76px, 11vh, 140px) clamp(20px, 4vw, 56px) clamp(80px, 12vh, 150px)",
        background: C.cream,
        overflow: "hidden",
        fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <style>{KEYFRAMES}</style>

      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: "-16%", right: "-8%",
          width: "44vw", maxWidth: 620, aspectRatio: "1", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(163,174,149,.22), transparent 66%)",
          pointerEvents: "none",
          animation: calm ? "none" : "ekasBloom 22s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: "-22%", left: "-10%",
          width: "38vw", maxWidth: 520, aspectRatio: "1", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(176,141,79,.16), transparent 64%)",
          pointerEvents: "none",
          animation: calm ? "none" : "ekasBloom 27s ease-in-out infinite reverse",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1560, margin: "0 auto" }}>
        <div
          ref={headerRef}
          className="relative flex flex-col items-center justify-center text-center mb-6 md:mb-10"
          style={{
            opacity: 0,
            transform: "translateY(24px)",
            transition:
              "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] font-serif">
              {title}
            </h2>
            <div className="h-1 w-16 bg-[#D9A528] rounded-full" />
          </div>

          <a
            href={ctaHref}
            className="md:absolute right-0 top-1/2 md:-translate-y-1/2 mt-6 md:mt-0 inline-flex items-center gap-3 px-8 py-3 rounded-full border border-[#2D5C35]/40 text-[#2D5C35] text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#2D5C35] hover:text-white transition-all"
          >
            {ctaLabel} <span>&rarr;</span>
          </a>
        </div>

        <div
          ref={gridRef}
          style={{
            opacity: 0,
            transform: "translateY(24px)",
            transition:
              "opacity .9s cubic-bezier(.16,1,.3,1) .12s, transform .9s cubic-bezier(.16,1,.3,1) .12s",
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: "clamp(18px, 2.4vw, 40px) clamp(10px, 1.4vw, 20px)",
            marginTop: "clamp(44px, 6.5vh, 78px)",
          }}
        >
          {items.map((item: any) => (
            <CollectionCard
              key={item.id}
              item={item}
              image={images[item.id]}
              onSelect={(cat: any) => router.push(cat.href)}
              calm={calm}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const KEYFRAMES = `
@keyframes ekasDash { to { stroke-dashoffset: -600; } }
@keyframes ekasBloom {
  0%, 100% { transform: translate3d(0,0,0) scale(1); opacity: .5; }
  50% { transform: translate3d(3%,-4%,0) scale(1.18); opacity: .82; }
}
@media (prefers-reduced-motion: reduce) {
  @keyframes ekasDash { to { stroke-dashoffset: 0; } }
  @keyframes ekasBloom { 0%, 100% { transform: none; opacity: .5; } }
}
`;
