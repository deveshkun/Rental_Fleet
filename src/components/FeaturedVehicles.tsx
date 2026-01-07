import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import VehicleCard from './VehicleCard';
import { vehicles, categories } from '@/data/vehicles';
import type { Vehicle } from '@/data/vehicles'; // <-- Add this
import BookingModal from "./BookingModal";


const FeaturedVehicles = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);


  const filteredVehicles = activeCategory === 'all'
    ? vehicles
    : vehicles.filter((v) => v.category === activeCategory);

  return (
    <section id="fleet" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Rides
          </span>
          <h2 className="section-heading mb-4">
            Find Your Perfect <span className="text-gradient">Ride</span>
          </h2>
          <p className="section-subheading mx-auto">
            Choose from a carefully curated collection of scooties, bikes, and cars that deliver comfort, convenience, and value.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Vehicle Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredVehicles.map((vehicle, index) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            index={index}
            onBook={(v) => setSelectedVehicle(v)} // ← opens modal
          />
        ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-2 btn-secondary px-8 py-4 text-lg group">
            View All Vehicles
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
            {selectedVehicle && (
              <BookingModal
                vehicle={selectedVehicle}
                onClose={() => setSelectedVehicle(null)} // closes modal
              />
            )}

      </div>
    </section>
  );
};

export default FeaturedVehicles;
