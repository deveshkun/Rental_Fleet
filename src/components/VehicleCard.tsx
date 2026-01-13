import { motion } from "framer-motion";
import { Star, Settings, Fuel, Users, Briefcase, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/data/vehicles";

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode: "grid" | "list";
  index: number;
  onQuickView: (vehicle: Vehicle) => void;
}

const VehicleCard = ({ vehicle, viewMode, index, onQuickView }: VehicleCardProps) => {
  // List View
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="glass-card rounded-xl overflow-hidden flex flex-col md:flex-row group vehicle-card"
      >
        {/* Image */}
        <div className="md:w-[350px] h-[260px] relative overflow-hidden bg-secondary flex-shrink-0">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {vehicle.available && <div className="badge-available absolute top-4 left-4">Available</div>}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {vehicle.name}
                </h3>
                <p className="text-muted-foreground capitalize">
                  {vehicle.year} • {vehicle.category}
                </p>
              </div>

              <div className="rating-badge">
                <Star size={16} className="fill-warning text-warning" />
                <span className="text-foreground font-medium">{vehicle.rating}</span>
                <span className="text-muted-foreground text-sm">({vehicle.reviewCount})</span>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-4">
              <div className="spec-item">
                <Settings size={18} className="text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Transmission</div>
                  <div className="font-medium text-foreground">{vehicle.specs.transmission}</div>
                </div>
              </div>

              <div className="spec-item">
                <Fuel size={18} className="text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Fuel</div>
                  <div className="font-medium text-foreground">{vehicle.specs.fuel}</div>
                </div>
              </div>

              <div className="spec-item">
                <Users size={18} className="text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Seats</div>
                  <div className="font-medium text-foreground">{vehicle.specs.seats}</div>
                </div>
              </div>

              <div className="spec-item">
                <Briefcase size={18} className="text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Luggage</div>
                  <div className="font-medium text-foreground">{vehicle.specs.luggage} bags</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mt-3">
              {vehicle.features.slice(0, 4).map((feature) => (
                <span
                  key={feature}
                  className="bg-secondary text-muted-foreground px-3 py-1 rounded-full text-xs"
                >
                  {feature}
                </span>
              ))}
              {vehicle.features.length > 4 && (
                <span className="text-primary text-xs font-medium px-2 py-1">
                  +{vehicle.features.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-foreground">
                  ₹{vehicle.price.daily}
                </span>
                <span className="text-muted-foreground">/day</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onQuickView(vehicle)}
                className="border-border hover:border-primary"
              >
                <Eye size={16} className="mr-2" />
                Quick View
              </Button>

              <Button className="btn-primary-gradient" disabled={!vehicle.available}>
                {vehicle.available ? "Book Now" : "Not Available"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass-card rounded-xl overflow-hidden group vehicle-card"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-secondary">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {vehicle.available && <div className="badge-available absolute top-4 left-4">Available</div>}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {vehicle.name}
            </h3>
            <p className="text-muted-foreground text-sm capitalize">
              {vehicle.year} • {vehicle.category}
            </p>
          </div>

          <div className="rating-badge">
            <Star size={14} className="fill-warning text-warning" />
            <span className="text-foreground font-medium text-sm">{vehicle.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-border text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-muted-foreground" />
            {vehicle.specs.transmission}
          </div>
          <div className="flex items-center gap-2">
            <Fuel size={14} className="text-muted-foreground" />
            {vehicle.specs.fuel}
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-muted-foreground" />
            {vehicle.specs.seats} seats
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-muted-foreground" />
            {vehicle.specs.luggage} bags
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-display font-bold text-foreground">
                ₹{vehicle.price.daily}
              </span>
              <span className="text-muted-foreground text-sm">/day</span>
            </div>
          </div>

          <Button size="sm" className="btn-primary-gradient" disabled={!vehicle.available}>
            {vehicle.available ? "Book Now" : "Not Available"}
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickView(vehicle)}
          className="w-full border-border hover:border-primary"
        >
          Quick View
        </Button>
      </div>
    </motion.div>
  );
};

export default VehicleCard;
