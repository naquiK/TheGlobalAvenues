import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTestimonials } from '../services/contentApi';
import { resolveMediaUrl } from '../services/apiClient';

const fallbackTestimonials = [
  {
    name: 'Vardha Kharbanda',
    location: 'New York',
    content: 'A truly professional team who extended support and trusted me throughout. I would like to express sincere gratitude to the whole team for all the support.',
    rating: 5,
  },
  {
    name: 'Pratibha Mittal',
    location: 'California',
    content: 'I am pleased with the service I\'ve received. Their professionalism and ability exceeded my expectations. The team showed commendable customer service.',
    rating: 5,
  },
  {
    name: 'Anuj Garg',
    location: 'Indiana',
    content: 'My experience with them was extremely nice. They have a very friendly environment where I got to learn a lot.',
    rating: 5,
  },
  {
    name: 'Vibha Kokiloo',
    location: 'Dubai',
    content: 'Amazing team and great services! I would definitely recommend you to my friends who want to study abroad.',
    rating: 5,
  },
  {
    name: 'Rajat Chohda',
    location: 'Netherlands',
    content: 'Just loved the way they work. If you are looking for genuine consultants, please visit them.',
    rating: 5,
  },
  {
    name: 'Waseem Akram',
    location: 'France',
    content: 'Wonderful experience with The Global Avenues. Highly professional and best consulting for students who want to study in Europe. Very grateful!',
    rating: 5,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, isVisible] = useScrollAnimation();
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const nextSlide = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [isAutoPlay, testimonials.length]);

  useEffect(() => {
    const controller = new AbortController();

    const loadTestimonials = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getTestimonials({ signal: controller.signal });
        const mapped = (data || []).map((item) => ({
          name: item.name,
          location: item.designation || item.location || 'Student',
          content: item.message || '',
          rating: Number(item.rating) || 5,
          photo: item.photo ? resolveMediaUrl(item.photo) : '',
        }));

        if (mapped.length > 0) {
          setTestimonials(mapped);
          setCurrentIndex(0);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message || 'Unable to load testimonials');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTestimonials();

    return () => controller.abort();
  }, []);

  return (
    <section id="testimonials" className="py-20 px-4 bg-gradient-to-b from-primary/5 to-secondary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-[30px]'
          }`}
        >
          <div className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-4">
            💬 Testimonials
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Stories From Our Satisfied Clients
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from students and institutions who have achieved their international education goals with our support.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {isLoading && (
            <div className="py-10 text-center text-muted-foreground">Loading testimonials...</div>
          )}

          {!isLoading && errorMessage && (
            <div className="py-10 text-center text-muted-foreground">{errorMessage}</div>
          )}

          {/* Slides */}
          <div className="overflow-hidden rounded-2xl">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 p-8 md:p-12 bg-background border border-border rounded-2xl mx-auto max-w-2xl">
                  {/* Stars */}
                  <div className="flex gap-2 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div>
                    <p className="font-bold text-foreground text-lg">{testimonial.name}</p>
                    <p className="text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => {
              prevSlide();
              setIsAutoPlay(false);
            }}
            className="absolute -left-6 top-1/2 -translate-y-1/2 p-3 bg-primary text-primary-foreground rounded-full hover:bg-secondary transition-all duration-300 transform hover:scale-110 shadow-lg z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              nextSlide();
              setIsAutoPlay(false);
            }}
            className="absolute -right-6 top-1/2 -translate-y-1/2 p-3 bg-primary text-primary-foreground rounded-full hover:bg-secondary transition-all duration-300 transform hover:scale-110 shadow-lg z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlay(false);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary w-8' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isAutoPlay
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
              }`}
            >
              {isAutoPlay ? '⏸ Auto-playing' : '▶ Paused'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
