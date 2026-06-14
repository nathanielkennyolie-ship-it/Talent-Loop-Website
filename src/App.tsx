import { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  Briefcase,
  Users,
  Award,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="font-sans text-gray-800 antialiased">
      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-18">
          <a href="/" className="flex items-center gap-2">
            <span
              className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
                scrolled ? "text-[#1a2b5f]" : "text-white"
              }`
            >
              Talent Loop
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {["Home", "About", "Jobs", "Blog", "Contact"].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors duration-300 hover:text-[#D4AF37] ${
                  scrolled ? "text-gray-700" : "text-white/90"
                }`}
              >
                {item}
              </a>
            ))}
            <a
              href="/assessment"
              className="bg-[#D4AF37] text-[#1a2b5f] px-5 py-2 rounded-md text-sm font-semibold hover:bg-[#c9a22e] transition-colors"
            >
              Take Assessment
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden transition-colors ${
              scrolled ? "text-gray-800" : "text-white"
            }`}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t">
            <div className="px-6 py-4 space-y-3">
              {["Home", "About", "Jobs", "Blog", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="block text-gray-700 text-sm font-medium py-2 hover:text-[#D4AF37]"
                >
                  {item}
                </a>
              ))}
              <a
                href="/assessment"
                className="block bg-[#D4AF37] text-[#1a2b5f] px-5 py-2 rounded-md text-sm font-semibold text-center mt-2"
              >
                Take Assessment
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero with Video Background ── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920"
        >
          <source
            src="https://videos.pexels.com/video-files/3184291/3184291-uhd_2560_1440_24fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2b5f]/80 via-[#0d1b3e]/70 to-[#1a2b5f]/85" />

        {/* Subtle animated grain for premium feel */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}} />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#D4AF37] text-sm md:text-base font-semibold tracking-widest uppercase mb-4 animate-fade-in">
            Recruitment Redefined
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
            Bridging the Gap Between{" "}
            <span className="text-[#D4AF37]">Talent</span> &{" "}
            <span className="text-[#D4AF37]">Opportunity</span>
          </h1>

          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Expert recruitment solutions connecting exceptional professionals
            with transformative career opportunities since 2015.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="flex-1 flex items-center px-5">
                <Search className="text-gray-400 mr-3 flex-shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="Job title, keyword, or company..."
                  className="w-full py-4 text-gray-700 text-sm md:text-base outline-none placeholder-gray-400"
                />
              </div>
              <button className="bg-[#1a2b5f] hover:bg-[#0d1b3e] text-white px-6 md:px-8 py-4 font-semibold text-sm md:text-base transition-colors flex items-center gap-2">
                Search <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-14 flex flex-wrap justify-center gap-8 md:gap-14">
            {[
              { icon: Briefcase, label: "Jobs Placed", value: "5,000+" },
              { icon: Users, label: "Partner Companies", value: "300+" },
              { icon: Award, label: "Success Rate", value: "94%" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="text-[#D4AF37] mb-1" size={22} />
                <span className="text-white text-2xl md:text-3xl font-bold">
                  {value}
                </span>
                <span className="text-white/60 text-xs uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/50 text-xs tracking-widest uppercase">
            Scroll
          </span>
          <ArrowRight size={16} className="text-white/50 rotate-90" />
        </div>
      </section>
    </div>
  );
}

export default App;
