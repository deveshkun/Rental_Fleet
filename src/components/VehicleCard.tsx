import { Users, Fuel, Settings, Briefcase, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Vehicle } from '@/data/vehicles';

const formatINR = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;


interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
  onBook?: (vehicle: Vehicle) => void; 
}

const categoryColors: Record<string, string> = {
  scooty: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  bike: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  suv: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  car: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const VehicleCard = ({ vehicle, index ,onBook}: VehicleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="vehicle-card"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/30 to-transparent dark:from-card" />       
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[vehicle.category]}`}>
          {vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)}
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm">
          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
          <span className="text-xs font-medium">{vehicle.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-xl font-bold mb-1">{vehicle.name}</h3>
            <p className="text-sm text-muted-foreground">{vehicle.year}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{formatINR(vehicle.price.daily)}</div>
            <div className="text-xs text-muted-foreground">/day</div>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-4 gap-3 py-4 border-t border-b border-border/50 mb-4">
          <div className="flex flex-col items-center gap-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{vehicle.specs.passengers}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{vehicle.specs.transmission.slice(0, 4)}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Fuel className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{vehicle.specs.fuel.slice(0, 4)}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{vehicle.specs.luggage}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 btn-secondary py-2.5 text-sm">
            View Details
          </button>
          <button className="flex-1 btn-primary py-2.5 text-sm"
          onClick={() => onBook && onBook(vehicle)} 
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleCard;
