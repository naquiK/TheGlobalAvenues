import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowRight, Bell, X } from 'lucide-react';
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
    { text: 'New Partnership with UK Universities!', link: '/news-blog' },
    { text: 'Latest IELTS Prep Guide Available', link: '/news-blog' },
    { text: 'Success Story: Student Placed in Canada', link: '/news-blog' },
    { text: 'Australia Visa Updates 2024', link: '/news-blog' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (!showNotification) return null;

  return (
    <div
      className={`py-2 px-4 md:py-3 text-sm md:text-base ${
        isDarkMode
          ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white'
          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <Bell className="w-4 h-4 flex-shrink-0 animate-pulse" />

          <Link
            to={notifications[currentIndex].link}
            className="flex-1 text-center font-medium hover:underline transition-all duration-300 group line-clamp-1"
          >
            {notifications[currentIndex].text}
            <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">
              →
            </span>
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

   <section
  id="home"
  className="relative min-h-screen flex items-center justify-center overflow-hidden"
>
  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
      alt="Students"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Content */}
  <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
      Explore Our
      <span className="block text-blue-300">Educational Pathways</span>
    </h1>

    <p className="text-lg sm:text-xl text-gray-200 mb-8">
      Transform your future by connecting with world-class universities and
      unlocking global opportunities
    </p>

    <Link
      to="/services"
      className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
    >
      Explore Pathways →
    </Link>
  </div>
</section>
    </>
  );
}