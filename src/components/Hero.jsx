import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowRight, Globe, Users, TrendingUp, Bell, X } from 'lucide-react';
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

const NotificationStrip = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const notifications = [
    { text: 'New Partnership with UK Universities! ', link: '/news-vlog' },
    { text: 'Latest IELTS Prep Guide Available ', link: '/news-vlog' },
    { text: 'Success Story: Student Placed in Canada ', link: '/news-vlog' },
    { text: 'Australia Visa Updates 2024 ', link: '/news-vlog' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, [notifications.length]);

  if (!showNotification) return null;

  return (
    <div className="bg-gradient-to-r from-accent/90 to-primary/90 text-white py-3 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <Bell className="w-4 h-4 flex-shrink-0 animate-pulse" />
          
          <Link
            to={notifications[currentIndex].link}
            className="flex-1 text-center text-sm md:text-base font-medium hover:underline transition-all duration-300 group"
          >
            {notifications[currentIndex].text}
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <button
            onClick={() => setShowNotification(false)}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="hidden sm:flex gap-1 ml-2">
            {notifications.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export function Hero() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <>
      <NotificationStrip />
      <section id="home" className="min-h-screen pt-20 px-4 flex items-center relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 -z-10"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div
          ref={ref}
          className={`space-y-8 transition-all duration-1000 ${
            isVisible ? 'animate-fade-in-left' : 'opacity-0 translate-x-[-30px]'
          }`}
        >
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold">
              ✨ Your Global Education Partner
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Unlock Your
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent block">
                International Potential
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Enabling international universities to effortlessly access the South Asian market through specialized in-country representation and expert guidance.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-8">
            <div className="p-4 bg-muted/50 rounded-lg backdrop-blur hover:bg-muted transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">{isVisible ? <CountUpNumber target={5000} /> : 0}+</span>
              </div>
              <p className="text-sm text-muted-foreground">Students Placed</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg backdrop-blur hover:bg-muted transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-5 h-5 text-secondary" />
                <span className="text-2xl font-bold text-foreground">{isVisible ? <CountUpNumber target={50} /> : 0}+</span>
              </div>
              <p className="text-sm text-muted-foreground">Universities</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg backdrop-blur hover:bg-muted transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <span className="text-2xl font-bold text-foreground">{isVisible ? <CountUpNumber target={98} /> : 0}%</span>
              </div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-secondary transition-all duration-300 transform hover:scale-105 flex items-center gap-2 group">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Content - Illustration */}
        <div
          className={`relative h-96 lg:h-full min-h-96 transition-all duration-1000 delay-200 ${
            isVisible ? 'animate-fade-in-right' : 'opacity-0 translate-x-[30px]'
          }`}
        >
          {/* Moving Light Effect */}
          <div className="corner-light"></div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-3xl blur-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-10 rounded-3xl"></div>
          <div className="absolute inset-4 bg-background rounded-3xl flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-gradient-to-br from-primary to-secondary rounded-full">
                <Globe className="w-16 h-16 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">Global Excellence</p>
              <p className="text-muted-foreground max-w-xs">Connecting talented students with world-class universities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
