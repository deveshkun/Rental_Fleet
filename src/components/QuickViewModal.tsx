import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Settings, Fuel, Users, Briefcase, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/data/vehicles";

interface QuickViewModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ vehicle, isOpen, onClose }: QuickViewModalProps) => {
  if (!vehicle) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card-solid rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">
                  {vehicle.name}
                </h2>
                <p className="text-muted-foreground capitalize">
                  {vehicle.year} • {vehicle.category}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X size={20} className="text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Image */}
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-72 object-cover rounded-xl mb-6"
              />

              {/* Specs */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="glass-card p-5 rounded-xl">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-4">
                    Specifications
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Settings size={18} />
                        <span>Transmission</span>
                      </div>
                      <span className="font-medium text-foreground">
                        {vehicle.specs.transmission}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Fuel size={18} />
                        <span>Fuel Type</span>
                      </div>
                      <span className="font-medium text-foreground">{vehicle.specs.fuel}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Users size={18} />
                        <span>Seats</span>
                      </div>
                      <span className="font-medium text-foreground">{vehicle.specs.seats}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Briefcase size={18} />
                        <span>Luggage</span>
                      </div>
                      <span className="font-medium text-foreground">
                        {vehicle.specs.luggage} bags
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="glass-card p-5 rounded-xl">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-4">
                    Features
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {vehicle.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Check size={16} className="text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="glass-card p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={18} className="fill-warning text-warning" />
                    <span className="font-medium text-foreground">{vehicle.rating}</span>
                    <span className="text-muted-foreground">
                      ({vehicle.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-display font-bold text-foreground">
                      ₹{vehicle.price.daily}
                    </span>
                    <span className="text-xl text-muted-foreground">/day</span>
                  </div>
                </div>

                <Button className="btn-primary-gradient px-8 py-6 text-lg" disabled={!vehicle.available}>
                  {vehicle.available ? "Book This Vehicle" : "Not Available"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
