"use client";

import { useEffect, useRef } from "react";
import { getAssetUrl } from "@/lib/getAsset";

export function LabTested() {
  const labTestedImage = getAssetUrl("EKAS_Homepage_04_LabTested.png");

  return (
    <section className="w-full bg-[#f6f5f0] pt-4 pb-12 md:pt-8 md:pb-24">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <div className="w-full flex justify-center">
          <img
            src={labTestedImage}
            alt="Lab Testing Process"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
