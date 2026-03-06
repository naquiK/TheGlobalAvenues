import { useState, useEffect } from 'react';
import { ChevronRight, Bell, BookOpen, Zap, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EducationSpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [showNotification, setShowNotification] = useState(true);

  const programs = [
    {
      id: 'fulltime-degree',
      name: 'Full Time Degree Program',
      description: 'Comprehensive 3-4 year programs from top universities worldwide',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      path: '/education-program/fulltime-degree/undergraduate',
      highlight: 'Popular Choice',
    },
    {
      id: 'online-program',
      name: 'Online Program',
      description: 'Flexible learning from anywhere in the world',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      path: '/education-program/online-program/undergraduate',
      highlight: 'Now Available',
    },
    {
      id: 'vocational-courses',
      name: 'Vocational Courses',
      description: 'Industry-focused certifications and skill development',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      path: '/education-program/vocational-courses/undergraduate',
      highlight: 'New',
    },
    {
      id: 'internship-abroad',
      name: 'Internship Abroad',
      description: 'Gain international experience with leading companies',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      path: '/education-program/internship-abroad/undergraduate',
      highlight: 'Hot Opportunity',
    },
    {
      id: 'summer-winter-school',
      name: 'Summer/Winter School',
      description: 'Short-term immersive learning experiences',
      icon: BookOpen,
      color: 'from-pink-500 to-pink-600',
      path: '/education-program/summer-winter-school/undergraduate',
      highlight: 'Limited Spots',
    },
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % programs.length);
    }, 6000);
    
    return () => clearInterval(timer);
  }, [isAutoPlay, programs.length]);

  const currentProgram = programs[currentIndex];
  const CurrentIcon = currentProgram.icon;

  return (
    <section className="relative py-16 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-accent/20 rounded-full mb-3 sm:mb-4 animate-slide-in-top">
            <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-accent animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-accent">Spotlight Programs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight animate-fade-in-down">
            Explore Our
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              Educational Pathways
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 leading-relaxed animate-fade-in-up animation-delay-200">
            Choose from diverse learning opportunities tailored to your goals and ambitions
          </p>
        </div>

        {/* Main Spotlight Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-8">
          {/* Main Spotlight Card */}
          <div className="lg:col-span-2 animate-fade-in-left animation-delay-200">
            <div
              className={`relative overflow-hidden rounded-2xl transition-all duration-500 ease-out transform hover:scale-105`}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            >
              {/* Animated Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${currentProgram.color} opacity-90 transition-all duration-500`}
              ></div>

              {/* Spotlight Blur Effect */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

              {/* Content */}
              <div className="relative p-6 sm:p-8 md:p-12 min-h-80 sm:min-h-96 lg:h-96 flex flex-col justify-between text-white z-10">
                <div>
                  <div className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-white/20 backdrop-blur rounded-full mb-4 sm:mb-6">
                    <span className="text-xs sm:text-sm font-semibold text-white">{currentProgram.highlight}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-6">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 leading-tight break-words">{currentProgram.name}</h3>
                      <p className="text-base sm:text-lg text-white/90 leading-relaxed">{currentProgram.description}</p>
                    </div>
                    <div className="p-2 sm:p-4 bg-white/20 backdrop-blur rounded-xl flex-shrink-0">
                      <CurrentIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to={currentProgram.path}
                  className="inline-flex items-center gap-2 px-4 sm:px-8 py-2 sm:py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg font-semibold transition-all duration-300 w-fit group text-sm sm:text-base"
                >
                  Explore Program
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Notification Popup in Spotlight - Hidden on mobile, dismissible on desktop */}
              {showNotification && (
                <div className="hidden sm:block absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4 border border-white/30 max-w-xs animate-bounce-in z-20">
                  <button
                    onClick={() => setShowNotification(false)}
                    className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded transition-colors"
                    aria-label="Close notification"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  <div className="flex items-start gap-2 sm:gap-3 pr-6">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-white">Limited Time Offer</p>
                      <p className="text-xs text-white/80 leading-snug">Applications closing soon. Secure your spot today!</p>
                      <a href="#contact" className="text-xs text-white/90 hover:text-white font-medium mt-1.5 sm:mt-2 inline-flex items-center gap-1 group">
                        Learn more <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Program Cards Grid */}
          <div className="space-y-3 sm:space-y-4 animate-fade-in-right animation-delay-300">
            {programs.map((program, index) => (
              <button
                key={program.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlay(false);
                }}
                className={`w-full p-3 sm:p-4 rounded-xl transition-all duration-300 transform text-left group text-sm sm:text-base ${
                  currentIndex === index
                    ? 'bg-primary text-white shadow-lg scale-100 sm:scale-105'
                    : 'bg-muted/50 hover:bg-muted text-foreground hover:scale-100 sm:hover:scale-102'
                }`}
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2">{program.name.split(' ').slice(0, 2).join(' ')}</p>
                    <p className={`text-xs ${currentIndex === index ? 'text-white/80' : 'text-muted-foreground'} line-clamp-2`}>
                      {program.description.substring(0, 35)}...
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 transition-transform mt-1 ${
                      currentIndex === index ? 'translate-x-1 text-white' : ''
                    }`}
                  />
                </div>

                {/* Progress Indicator */}
                <div className={`mt-2 sm:mt-3 h-1 rounded-full overflow-hidden ${currentIndex === index ? 'bg-white/30' : 'bg-muted'}`}>
                  <div
                    className={`h-full ${currentIndex === index ? 'bg-white' : 'bg-primary'} transition-all duration-500`}
                    style={{
                      width: currentIndex === index ? '100%' : '0%',
                      animation: currentIndex === index && isAutoPlay ? 'progress 6s linear' : 'none',
                    }}
                  ></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-8 sm:mt-12 px-2">
          {programs.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlay(false);
              }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary w-6 sm:w-8' : 'bg-muted w-1.5 sm:w-2 hover:bg-muted-foreground'
              }`}
              aria-label={`Go to program ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CSS Animation for Progress Bar */}
      <style>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
