import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function ImageCarousel() {
  const [ref, isVisible] = useScrollAnimation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop&q=80',
      title: 'Global University Network',
      description: 'Connect with over 500+ prestigious universities across 50+ countries worldwide.',
      color: 'from-blue-500 to-cyan-500',
      icon: '🌍',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1542744095-fcf47deaf0ff?w=800&h=600&fit=crop&q=80',
      title: 'Expert Student Support',
      description: 'Dedicated mentors guiding you through every step of your international education journey.',
      color: 'from-purple-500 to-pink-500',
      icon: '👨‍🎓',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&q=80',
      title: 'Diverse Learning Programs',
      description: 'Explore thousands of academic programs tailored to your goals and aspirations.',
      color: 'from-orange-500 to-red-500',
      icon: '📚',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop&q=80',
      title: 'Career Pathways',
      description: 'Transform your future with world-class education and career opportunities.',
      color: 'from-green-500 to-emerald-500',
      icon: '🚀',
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center mb-16 sm:mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose Us
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore the key aspects that make us your perfect education partner
          </p>
        </div>

        {/* Unique 3D Card Carousel Layout */}
        <div className="relative h-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Side - Main Featured Card */}
            <div className="w-full lg:w-1/2">
              <div
                className={`relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 h-96 sm:h-[450px]`}
              >
                {/* Main Image */}
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].color} opacity-30`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-8">
                  <div className="text-5xl">{slides[currentSlide].icon}</div>
                  <div className={`transform transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                      {slides[currentSlide].title}
                    </h3>
                    <p className="text-lg text-gray-100">
                      {slides[currentSlide].description}
                    </p>
                  </div>
                </div>

                {/* Play Button Indicator */}
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/50 rounded-full p-3 hover:bg-white/30 transition-all cursor-pointer">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
            </div>

            {/* Right Side - Stack of Cards */}
            <div className="w-full lg:w-1/2 space-y-4">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                    index === currentSlide
                      ? 'ring-4 ring-blue-500 shadow-2xl scale-105'
                      : 'shadow-lg hover:shadow-xl'
                  }`}
                >
                  {/* Card Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-80`}></div>
                  
                  {/* Card Image Background */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                  />

                  {/* Card Content */}
                  <div className="relative p-6 sm:p-8 h-32 sm:h-40 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-4xl mb-3">{slide.icon}</div>
                        <h4 className="text-xl sm:text-2xl font-bold text-white">
                          {slide.title}
                        </h4>
                      </div>
                      {index === currentSlide && (
                        <div className="text-white text-opacity-70 text-3xl">→</div>
                      )}
                    </div>
                  </div>

                  {/* Hover Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls - Bottom */}
          <div className="flex items-center justify-center gap-4 mt-12 sm:mt-16">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? 'bg-blue-600 w-12 h-3'
                      : 'bg-gray-300 dark:bg-gray-600 w-3 h-3 hover:bg-gray-400 cursor-pointer'
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Counter */}
          <div className="text-center mt-6 text-gray-600 dark:text-gray-400">
            <span className="text-lg font-semibold">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 sm:mt-32 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { number: '500+', label: 'Universities' },
            { number: '50+', label: 'Countries' },
            { number: '10K+', label: 'Students' },
            { number: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <div
              key={index}
              className={`text-center p-8 sm:p-10 rounded-2xl bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-blue-500`}
            >
              <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3">
                {stat.number}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
