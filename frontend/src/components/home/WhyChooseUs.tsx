import { Leaf, Award, Heart, ShieldCheck, Sprout, Users } from "lucide-react";

const features = [
    {
        title: "Native Sourcing",
        description: "Natural, chemical-free raw materials collected directly from native farmers across India.",
        // Custom SVG: Tree Silhouette
        icon: (
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-16 h-16 text-[#2E4F32] mb-6">
                <path d="M47.7,85.2 C48.5,74.5 48.9,65.3 49.3,55.1 C44.5,56.5 40.5,58.3 35.8,59.2 C31.7,59.9 28.5,58.2 26.6,54.5 C24.6,50.6 25.1,46.7 28.2,43.2 C31.1,39.8 35.5,37.1 39.8,36.5 C36.9,34.5 33.6,33.4 30.6,30.8 C28.1,28.7 26.8,25.8 26.8,22.6 C26.7,18.4 29.5,14.5 33.6,13.1 C37.8,11.7 42.1,12.7 45.4,15.6 C46.7,13.1 48.2,10.9 49.8,9.2 C53.9,4.9 59.8,3.9 65.2,6.5 C70.2,8.9 73.1,13.8 73.1,19.3 C73.1,23.3 71.4,26.7 68.6,29.3 C71.6,31.7 75.1,33.5 77.4,36.9 C79.6,40.1 79.5,44.2 76.9,47.8 C74.6,50.9 71.2,52.9 67.5,54.5 C66.8,54.8 66.1,55.2 65.5,55.5 C67.4,65.5 68.9,75.1 70.8,85.2 C64.6,85.7 57.5,86.0 47.7,85.2 Z M53.2,55.2 C54.3,47.3 55.4,39.5 56.4,31.7 C51.4,30.1 47.2,31.9 44.2,36.6 C44.1,36.8 44.0,37.0 43.8,37.2 C45.3,43.3 46.8,49.4 48.2,55.5 C49.9,55.5 51.5,55.4 53.2,55.2 Z" />
                <circle cx="35" cy="90" r="1.5" />
                <circle cx="42" cy="89" r="1.5" />
                <circle cx="60" cy="89" r="1.5" />
                <circle cx="68" cy="90" r="1.5" />
                <circle cx="53" cy="91" r="2" />
            </svg>
        )
    },
    {
        title: "Traditional Processing",
        description: "Traditional, time-tested extraction methods ensuring maximum nutrition without any chemicals.",
        // Custom SVG: Mortar/Pestle & Churner
        icon: (
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-16 h-16 text-[#2E4F32] mb-6">
                <path d="M25,85 L75,85 L75,90 L25,90 Z M38,80 L62,80 C68,80 72,70 72,60 C72,50 68,45 62,45 L38,45 C32,45 28,50 28,60 C28,70 32,80 38,80 Z M32,15 L38,15 L38,40 L32,40 Z M62,25 L68,25 L68,45 L62,45 Z" />
                <path d="M42,55 C42,65 58,65 58,55" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
        )
    },
    {
        title: "Extensive Quality Checks",
        description: "Everything goes through 40+ strict lab tests to ensure 100% purity, safety, and authenticity.",
        // Custom SVG: Clipboard with Check & Magnifying Glass
        icon: (
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-16 h-16 text-[#2E4F32] mb-6">
                <path d="M30,15 L70,15 L70,85 L30,85 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M40,10 L60,10 L60,20 L40,20 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M40,35 L50,35 M40,50 L45,50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M35,35 L35.1,35 M35,50 L35.1,50 M35,65 L35.1,65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <circle cx="70" cy="65" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M80,75 L95,90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <path d="M62,65 L68,71 L78,57" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
        )
    },
    {
        title: "Women Empowerment",
        description: "Empowering rural women and farmer families who work dedicatedly to bring you the best.",
        // Custom SVG: Tractor Silhouette
        icon: (
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-16 h-16 text-[#2E4F32] mb-6">
                <path d="M85,55 L85,45 L70,45 L65,30 L45,30 L45,20 L40,20 L40,50 L25,50 L25,60 C25,68 30,75 35,75 C40,75 45,68 45,60 L65,60 C65,68 70,75 75,75 C80,75 85,68 85,60 Z" />
                <circle cx="35" cy="60" r="6" fill="#fff" />
                <circle cx="75" cy="60" r="4" fill="#fff" />
                <path d="M25,55 L15,55 L15,45 L25,45 Z" />
                <rect x="50" y="30" width="10" height="20" />
            </svg>
        )
    }
];

export function WhyChooseUs() {
    return (
        <section className="py-4 md:py-8 bg-[#FAFAFA] border-t border-gray-100">
            <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#2E4F32]">
                        Why Choose Ekas?
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {features.map((feature, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            {feature.icon}
                            <h3 className="text-[17px] font-bold mb-3 text-[#2E4F32] font-serif">
                                {feature.title}
                            </h3>
                            <p className="text-[#666666] leading-relaxed text-[13px] font-sans px-2">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
