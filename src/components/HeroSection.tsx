import { useEffect, useRef } from 'react';
import { ChevronDown, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import anime from 'animejs';
import { useToast } from '@/hooks/use-toast';

const HeroSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Animate title letters
    if (titleRef.current) {
      const text = titleRef.current.innerText;
      titleRef.current.innerHTML = text
        .split('')
        .map((char) => `<span class="letter inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('');

      anime({
       targets: titleRef.current,
       translateY: [60, 0],
       opacity: [0, 1],
       easing: 'easeOutExpo',
       duration: 1200,
       delay: 500,
       });
    }
  }, []);

  const scrollToBooking = () => {
    const element = document.querySelector('#booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      toast({
        title: '📋 Ready to Book',
        description: 'Complete the form to reserve your dream vehicle',
      });
    }
  };

  const scrollToFleet = () => {
    const element = document.querySelector('#fleet');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      toast({
        title: '🚗 Explore Our Fleet',
        description: 'Browse 150+ premium vehicles',
      });
    }
  };

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/80" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Premium Vehicle Rentals</span>
          </motion.div>

          {/* Main Title */}
          <h1 
            ref={titleRef}
            className="font-display font-bold tracking-tight mb-6 overflow-hidden text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight"
          >
            Drive Your Dreams
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
          Experience freedom on wheels. From quick city scooties and powerful bikes to comfortable cars, find the perfect ride for every journey at unbeatable prices.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={scrollToBooking}
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2 animate-pulse-glow"
            >
              Book Your Ride
              <ChevronDown className="w-5 h-5" />
            </button>
            <button
              onClick={scrollToFleet}
              className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Explore Rides
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            {[
              { value: '150+', label: 'Vehicles' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '20+', label: 'Locations' },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToBooking}
        >
          <span className="text-sm text-muted-foreground">Scroll to explore</span>
          <ChevronDown className="w-6 h-6 text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
