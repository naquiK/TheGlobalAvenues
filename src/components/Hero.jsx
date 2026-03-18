import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { ArrowRight, Users, Globe, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { SITE_CONFIG } from "../config";

const CountUpNumber = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
};

export function Hero() {
  const [ref, isVisible] = useScrollAnimation();
  const studentsPlaced = Number.parseInt(SITE_CONFIG.stats.studentsRecruited, 10);
  const partnerUniversities = Number.parseInt(SITE_CONFIG.stats.partnerUniversities, 10);
  const visaSuccessRate = Number.parseInt(SITE_CONFIG.stats.visaSuccessRate, 10);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Students"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Hero Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 text-center max-w-4xl mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Unlock Your Potential With
            <span className="block text-blue-300 text-5xl sm:text-6xl lg:text-7xl mt-2">
              {SITE_CONFIG.company.name.toUpperCase()}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            {SITE_CONFIG.company.description}
            <span className="text-blue-300 font-semibold">
              {" "}{SITE_CONFIG.company.tagline}
            </span>
          </p>

          {/* Button */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
          >
            Explore Pathways
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Stats Section */}
   <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-6 pb-16">
  
  {/* Card 1 */}
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg text-left text-white">
    <Users className="text-blue-400 mb-3" size={28} />
    <h3 className="text-3xl font-bold">
      <CountUpNumber target={studentsPlaced} />+
    </h3>
    <p className="text-gray-200 mt-1">Students Placed</p>
  </div>

  {/* Card 2 */}
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg text-left text-white">
    <Globe className="text-blue-400 mb-3" size={28} />
    <h3 className="text-3xl font-bold">
      <CountUpNumber target={partnerUniversities} />+
    </h3>
    <p className="text-gray-200 mt-1">Universities</p>
  </div>

  {/* Card 3 */}
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg text-left text-white">
    <Award className="text-blue-400 mb-3" size={28} />
    <h3 className="text-3xl font-bold">
      <CountUpNumber target={visaSuccessRate} />%
    </h3>
    <p className="text-gray-200 mt-1">Success Rate</p>
  </div>

</div>
    </section>
  );
}
