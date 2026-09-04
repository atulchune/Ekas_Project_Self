"use client";

import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

export function QuickShop() {
  // Use the first 4 products for the homepage QuickShop
  const products = PRODUCTS.slice(0, 4);

  return (
    <section className="bg-surface-container-low py-16 md:py-24" id="shop">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-16 gap-6">
          <div>
            <span className="font-label-caps text-[length:var(--text-label-caps)] font-semibold text-secondary mb-4 block tracking-widest uppercase">EKAS PANTRY</span>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-[length:var(--text-headline-lg-mobile)] md:text-[length:var(--text-headline-lg)] text-primary">SHOP THE COLLECTION</h2>
          </div>
          
          <div className="flex items-center gap-8 md:gap-12 w-full md:w-auto overflow-x-auto pb-4 md:pb-0">
            {/* Category Pill Container */}
            <div className="flex items-center bg-transparent border border-[#d2cab3] rounded-[6px] p-[2px]">
              <button className="bg-primary text-white font-label-caps text-[11px] font-semibold px-4 py-2 rounded-[4px] uppercase tracking-wider">
                ALL
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-[11px] font-semibold px-4 py-2 uppercase tracking-wider">
                OILS
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-[11px] font-semibold px-4 py-2 uppercase tracking-wider whitespace-nowrap">
                BILONA GHEE
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-[11px] font-semibold px-4 py-2 uppercase tracking-wider whitespace-nowrap">
                FESTIVE BUNDLES
              </button>
            </div>
            
            <Link href="/shop" className="font-label-caps text-[11px] font-bold text-primary border-b border-primary pb-0.5 hover:text-secondary hover:border-secondary transition-colors whitespace-nowrap uppercase tracking-widest shrink-0">
              VIEW ALL PRODUCTS →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-gutter)]">
          {products.map((product) => (
            <div key={product.id} className="group bg-surface-container-lowest p-6 rounded flex flex-col border border-secondary/10 hover:border-secondary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] h-full">
              <div className="relative w-full aspect-[4/5] mb-8 bg-[#EAE5D9] overflow-hidden rounded">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-700" 
                  style={{ backgroundImage: `url('${product.image}')` }}
                ></div>
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-background border border-secondary/30 px-3 py-1 rounded font-label-caps text-[10px] uppercase font-semibold text-primary tracking-widest shadow-sm">
                    {product.badge}
                  </div>
                )}
              </div>
              
              <div className="text-center flex-grow flex flex-col">
                <h3 className="font-quote text-[length:var(--text-quote)] text-primary mb-2">{product.name}</h3>
                <p className="font-body-md text-[length:var(--text-body-md)] text-on-surface-variant mb-6 flex-grow line-clamp-2">{product.shortDescription}</p>
                
                <div className="flex items-center justify-center gap-2 mb-6">
                  {product.sizes.map((size, i) => (
                    <span 
                      key={size.label} 
                      className={`font-label-caps text-[11px] font-semibold px-3 py-1 rounded cursor-pointer ${i === 1 || (i===0 && product.sizes.length===1) ? 'border border-primary bg-primary text-on-primary' : 'border border-secondary/40 hover:bg-secondary/10 text-secondary'}`}
                    >
                      {size.label}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-body-md text-[length:var(--text-body-md)] font-semibold text-primary">
                    ₹{product.sizes[1]?.price || product.sizes[0].price}
                  </span>
                  <button className="bg-primary-container text-on-primary font-label-caps text-[length:var(--text-label-caps)] font-semibold px-6 py-3 rounded hover:bg-primary transition-colors uppercase tracking-widest">
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
