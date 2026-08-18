import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, MessageCircle, ShoppingBag } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#17301A] text-white pt-16 pb-8 relative overflow-hidden z-0">
            {/* Subtle Traditional Wood-Press (Ghani/Ox) SVG Background */}
            <svg viewBox="0 0 1000 400" className="absolute bottom-0 right-0 w-full min-w-[800px] h-[120%] opacity-[0.04] text-[#D9A528] pointer-events-none -z-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMaxYMax meet">
                {/* Ground Line */}
                <path d="M 0 350 L 1000 350" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Sun/Backdrop */}
                <circle cx="500" cy="180" r="140" strokeWidth="1" strokeDasharray="8 8" />
                
                {/* Ghani (Wooden Press Base) */}
                <path d="M 700 350 L 700 230 C 700 200 780 200 780 230 L 780 350" strokeWidth="3" />
                <path d="M 680 230 C 680 260 800 260 800 230 C 800 200 680 200 680 230" strokeWidth="3" />
                <path d="M 690 350 C 690 370 790 370 790 350" strokeWidth="3" />
                
                {/* Pestle (Crushing Wood) */}
                <path d="M 720 240 L 650 80 L 680 70 L 750 230" strokeWidth="3" />
                <path d="M 735 235 L 750 280 L 710 280" />
                
                {/* Connecting Beam */}
                <path d="M 660 100 Q 500 200 300 220" strokeWidth="4" />
                <path d="M 660 110 Q 500 210 300 230" strokeWidth="4" />
                
                {/* Ox Representation */}
                <path d="M 320 220 C 350 210 380 230 380 260 L 380 350" strokeWidth="3" /> {/* Hind leg */}
                <path d="M 350 250 L 350 350" strokeWidth="3" /> {/* Other hind leg */}
                <path d="M 380 230 C 350 150 250 150 200 200" strokeWidth="3" /> {/* Back */}
                <path d="M 200 200 C 180 220 180 250 190 280 L 190 350" strokeWidth="3" /> {/* Front leg */}
                <path d="M 220 240 L 220 350" strokeWidth="3" /> {/* Other front leg */}
                <path d="M 200 200 C 180 180 150 180 150 210 C 150 230 180 240 200 220" strokeWidth="3" /> {/* Head */}
                <path d="M 180 190 Q 150 150 120 160" strokeWidth="3" /> {/* Horn 1 */}
                <path d="M 170 190 Q 180 140 210 140" strokeWidth="3" /> {/* Horn 2 */}
                <path d="M 380 220 Q 420 240 400 280" strokeWidth="2" /> {/* Tail */}
                
                {/* Yoke/Harness */}
                <path d="M 180 190 L 320 210" strokeWidth="5" />
                
                {/* Drops indicating oil */}
                <path d="M 740 280 Q 750 310 740 320 Q 730 310 740 280" fill="currentColor" stroke="none" />
                <path d="M 820 130 Q 830 160 820 170 Q 810 160 820 130" fill="currentColor" stroke="none" />
                <path d="M 600 60 Q 610 90 600 100 Q 590 90 600 60" fill="currentColor" stroke="none" />
            </svg>

            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block relative w-[220px] h-[55px] group">
                            <Image
                                src="/images/logo.png"
                                alt="Healthy Foods Logo"
                                fill
                                unoptimized
                                className="object-contain object-left transition-opacity group-hover:opacity-100"
                            />
                        </Link>
                        <p className="text-gray-300 text-[13px] leading-relaxed max-w-xs">
                            Providing distinctively pure, cold-pressed, and organic oils.
                            Straight from the farm to your kitchen, ensuring health in every drop.
                        </p>
                        <div className="flex space-x-3 pt-2">
                            <a href="https://www.facebook.com/EkasHealthyFoods" target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 p-2.5 rounded-full hover:bg-[#D9A528] hover:border-[#D9A528] hover:text-[#17301A] transition-all duration-300"><Facebook className="w-4 h-4" /></a>
                            <a href="https://www.instagram.com/ekashealthyfoods" target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 p-2.5 rounded-full hover:bg-[#D9A528] hover:border-[#D9A528] hover:text-[#17301A] transition-all duration-300"><Instagram className="w-4 h-4" /></a>
                            <a href="https://api.whatsapp.com/send?phone=919081238888&text=Hello%2C+Please+share+me+some+details+regarding+Ekas+Healthy+Food+Products-" target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 p-2.5 rounded-full hover:bg-[#D9A528] hover:border-[#D9A528] hover:text-[#17301A] transition-all duration-300" aria-label="WhatsApp">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-[11px] uppercase tracking-widest mb-6 text-[#D9A528]">Shop</h4>
                        <ul className="space-y-4 text-[13px] text-gray-300">
                            <li><Link href="/shop" className="hover:text-white hover:translate-x-1 transition-all inline-block">All Products</Link></li>
                            <li><Link href="/shop?category=cold-pressed" className="hover:text-white hover:translate-x-1 transition-all inline-block">Cold Pressed Oils</Link></li>
                            <li><Link href="/shop?category=organic" className="hover:text-white hover:translate-x-1 transition-all inline-block">Organic Ghee</Link></li>
                            <li><Link href="/shop?category=combos" className="hover:text-white hover:translate-x-1 transition-all inline-block">Gift Combos</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-[11px] uppercase tracking-widest mb-6 text-[#D9A528]">Company</h4>
                        <ul className="space-y-4 text-[13px] text-gray-300">
                            <li><Link href="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block">Our Story</Link></li>
                            <li><Link href="/blogs" className="hover:text-white hover:translate-x-1 transition-all inline-block">Health Blogs</Link></li>
                            <li><Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contact Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-[11px] uppercase tracking-widest mb-6 text-[#D9A528]">Contact</h4>
                        <ul className="space-y-5 text-[13px] text-gray-300">
                            <li className="flex items-start space-x-3 group">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#D9A528]" />
                                <span className="max-w-[250px] leading-relaxed group-hover:text-white transition-colors">Plot No. 39, Survey No. 486/3, 486/4, Diamond Industrial Estate, Daman 396210</span>
                            </li>
                            <li className="flex items-center space-x-3 group">
                                <Phone className="w-4 h-4 text-[#D9A528]" />
                                <span className="group-hover:text-white transition-colors">+91 9081238888</span>
                            </li>
                            <li className="flex items-center space-x-3 group">
                                <Mail className="w-4 h-4 text-[#D9A528]" />
                                <span className="group-hover:text-white transition-colors">wecare@ekashealthyfoods.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-[11px] text-gray-500 font-medium tracking-wide flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© {new Date().getFullYear()} EKAS Healthy Foods. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-[#D9A528] transition-colors">Terms & Conditions</Link>
                        <Link href="/privacy" className="hover:text-[#D9A528] transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
