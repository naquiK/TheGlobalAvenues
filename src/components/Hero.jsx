import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowRight, Globe, Users, TrendingUp, Bell, X, BookOpen, Compass, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

const NotificationStrip = ({ isDarkMode }) => {
  const [showNotification, setShowNotification] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const notifications = [
    { text: 'New Partnership with UK Universities! ', link: '/news-blog' },
    { text: 'Latest IELTS Prep Guide Available ', link: '/news-blog' },
    { text: 'Success Story: Student Placed in Canada ', link: '/news-blog' },
    { text: 'Australia Visa Updates 2024 ', link: '/news-blog' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [notifications.length]);

  if (!showNotification) return null;

  return (
    <div className={`py-2 px-4 md:py-3 text-sm md:text-base ${
      isDarkMode 
        ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white' 
        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <Bell className="w-4 h-4 flex-shrink-0 animate-pulse" />
          
          <Link
            to={notifications[currentIndex].link}
            className="flex-1 text-center font-medium hover:underline transition-all duration-300 group line-clamp-1"
          >
            {notifications[currentIndex].text}
            <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <button
            onClick={() => setShowNotification(false)}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export function Hero() {
  const [ref, isVisible] = useScrollAnimation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <NotificationStrip isDarkMode={isDarkMode} />
      <section id="home" className={`relative w-full overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-950' 
          : 'bg-white'
      }`}>
        {/* Subtle background gradient */}
        <div className={`absolute inset-0 -z-10 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900' 
            : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
        }`}></div>
        
        {/* Decorative elements */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 -z-10 animate-pulse ${
          isDarkMode 
            ? 'bg-blue-900' 
            : 'bg-blue-100'
        }`}></div>
        <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 -z-10 animate-pulse ${
          isDarkMode 
            ? 'bg-indigo-900' 
            : 'bg-indigo-100'
        }`} style={{ animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div
              ref={ref}
              className={`space-y-6 sm:space-y-8 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-blue-900/50 ' 
                  : 'bg-blue-100'
              }`}>
                <Compass className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Your Global Education Gateway</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4 animate-fade-in-up">
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-white' 
                    : 'text-gray-900'
                }`}>
                  Explore Our
                  <span className={`block ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Educational Pathways</span>
                </h1>
                <p className={`text-lg sm:text-xl leading-relaxed max-w-lg transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-gray-300' 
                    : 'text-gray-600'
                }`}>
                  Connect with world-class universities, unlock international opportunities, and transform your future through expert guidance and specialized support.
                </p>
              </div>

              {/* Key Points */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 sm:py-8 animate-fade-in-up animation-delay-200">
                <div className={`p-3 sm:p-4 rounded-lg border transition-all hover:shadow-lg transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 hover:border-blue-500' 
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}>
                  <Users className={`w-5 h-5 mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{isVisible ? <CountUpNumber target={5000} /> : 0}+</div>
                  <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Students Placed</p>
                </div>
                <div className={`p-3 sm:p-4 rounded-lg border transition-all hover:shadow-lg transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 hover:border-indigo-500' 
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}>
                  <Globe className={`w-5 h-5 mb-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{isVisible ? <CountUpNumber target={50} /> : 0}+</div>
                  <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Universities</p>
                </div>
                <div className={`p-3 sm:p-4 rounded-lg border transition-all hover:shadow-lg transform hover:scale-105 col-span-2 sm:col-span-1 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 hover:border-blue-500' 
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}>
                  <Award className={`w-5 h-5 mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{isVisible ? <CountUpNumber target={98} /> : 0}%</div>
                  <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Success Rate</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 animate-fade-in-up animation-delay-400">
                <Link 
                  to="/services"
                  className={`px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 group transform hover:scale-105 text-center ${
                    isDarkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                  Explore Pathways
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/about"
                  className={`px-6 sm:px-8 py-3 border-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-center ${
                    isDarkMode 
                      ? 'border-slate-600 text-gray-300 hover:border-blue-400 hover:text-blue-400' 
                      : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                  }`}>
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Content - Visual */}
            <div
              className={`relative hidden lg:flex items-center justify-center transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="relative w-full h-96">
                {/* Card 1 */}
                <div className={`absolute top-0 left-0 right-0 mx-auto w-64 h-48 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  <BookOpen className="w-8 h-8 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Study Programs</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-100'}`}>Access 1000+ programs across top universities</p>
                </div>

                {/* Card 2 */}
                <div className={`absolute top-40 left-12 w-64 h-48 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700' 
                    : 'bg-gradient-to-br from-indigo-500 to-indigo-600'
                }`}>
                  <Compass className="w-8 h-8 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Expert Guidance</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-indigo-200' : 'text-indigo-100'}`}>Personalized mentorship at every step</p>
                </div>

                {/* Card 3 */}
                <div className={`absolute top-80 left-40 right-0 w-64 h-48 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-br from-blue-400 to-blue-500'
                }`}>
                  <Award className="w-8 h-8 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Global Success</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-100'}`}>Join thousands of successful alumni</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
