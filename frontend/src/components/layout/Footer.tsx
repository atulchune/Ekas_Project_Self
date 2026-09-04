import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#122b1c] w-full py-16 md:py-24 font-body-md text-[#d8d3c5] relative overflow-hidden">
      {/* Optional faint background line-art if available, otherwise just color */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('/images/EKAS_Homepage_07_Heritage.png')", backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "luminosity" }}></div>
      
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-[var(--spacing-gutter)] mb-16">
          
          {/* Left section: Logo and Tagline */}
          <div className="md:col-span-4 flex flex-col items-start">
            <Link href="/" className="inline-block relative w-[160px] h-[50px] group mb-6 hover:opacity-80 transition-opacity">
              <Image
                src="/images/logo.png"
                alt="EKAS Logo"
                fill
                unoptimized
                className="object-contain object-left brightness-0 invert"
              />
            </Link>
            <p className="text-[13px] md:text-[14px] leading-relaxed mb-8 max-w-sm text-[#e2dfd5]">
              Providing distinctively pure, cold-pressed, and organic oils. Straight from the farm to your kitchen, ensuring health in every drop.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <span className="text-white text-lg">f</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-white text-[18px]">photo_camera</span>
              </a>
              <a href="https://wa.me/919081238888" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-white text-[18px]">chat</span>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-8">
            
            {/* Shop Column */}
            <div className="flex flex-col space-y-4">
              <h4 className="font-label-caps text-[12px] font-bold text-[#d2ad4f] tracking-widest mb-4 uppercase">Shop</h4>
              <Link href="/product" className="text-[14px] text-[#e2dfd5] hover:text-white transition-colors">All Products</Link>
              <Link href="/product?category=wood-pressed" className="text-[14px] text-[#e2dfd5] hover:text-white transition-colors">Cold Pressed Oils</Link>
              <Link href="/product?category=ghee" className="text-[14px] text-[#e2dfd5] hover:text-white transition-colors">Organic Ghee</Link>
              <Link href="/bundles" className="text-[14px] text-[#e2dfd5] hover:text-white transition-colors">Gift Combos</Link>
            </div>

            {/* Company Column */}
            <div className="flex flex-col space-y-4">
              <h4 className="font-label-caps text-[12px] font-bold text-[#d2ad4f] tracking-widest mb-4 uppercase">Company</h4>
              <Link href="/our-story" className="text-[14px] text-[#e2dfd5] hover:text-white transition-colors">Our Story</Link>
              <Link href="/blogs" className="text-[14px] text-[#e2dfd5] hover:text-white transition-colors">Health Blogs</Link>
              <Link href="/contact" className="text-[14px] text-[#e2dfd5] hover:text-white transition-colors">Contact Us</Link>
              <Link href="/privacy" className="text-[14px] text-[#e2dfd5] hover:text-white transition-colors">Privacy Policy</Link>
            </div>

            {/* Contact Column */}
            <div className="flex flex-col space-y-5">
              <h4 className="font-label-caps text-[12px] font-bold text-[#d2ad4f] tracking-widest mb-3 uppercase">Contact</h4>
              
              <div className="flex items-start gap-3 text-[#e2dfd5]">
                <span className="material-symbols-outlined text-[#d2ad4f] text-[20px] mt-0.5 shrink-0">location_on</span>
                <span className="text-[14px] leading-snug">Plot No. 39, Survey No. 486/3, 486/4,<br/>Diamond Industrial Estate, Daman 396210</span>
              </div>
              
              <div className="flex items-center gap-3 text-[#e2dfd5]">
                <span className="material-symbols-outlined text-[#d2ad4f] text-[20px] shrink-0">call</span>
                <span className="text-[14px]">+91 9081238888</span>
              </div>
              
              <div className="flex items-center gap-3 text-[#e2dfd5]">
                <span className="material-symbols-outlined text-[#d2ad4f] text-[20px] shrink-0">mail</span>
                <span className="text-[14px]">wecare@ekashealthyfoods.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-white/50">
            © {new Date().getFullYear()} EKAS Healthy Foods. All rights reserved.
          </p>

          <div className="flex space-x-6 text-[12px]">
            <Link href="/terms" className="text-white/50 hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
