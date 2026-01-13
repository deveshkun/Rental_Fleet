import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Car, Settings, Fuel, Users, Star, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/vehicles";

interface FilterSidebarProps {
  filters: {
    priceRange: [number, number];
    types: string[];
    transmission: string[];
    fuel: string[];
    seats: string[];
    features: string[];
  };
  onFilterChange: (filters: FilterSidebarProps["filters"]) => void;
  onClose?: () => void;
  vehicleCounts?: Record<string, number>;
}

const vehicleTypes = ["scooty", "bike", "car", "suv"];
const transmissionTypes = ["Automatic", "Manual"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
const seatOptions = ["2 seats", "4 seats", "5 seats", "7+ seats"];
const featureOptions = [
  "Sunroof",
  "Wireless Charging",
  "Fast Charging",
  "Apple CarPlay",
  "Alexa Built-in",
  "ADAS Level 2",
];

const FilterSidebar = ({ filters, onFilterChange, onClose, vehicleCounts = {} }: FilterSidebarProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleCheckboxChange = (category: keyof typeof filters, value: string) => {
    if (category === "priceRange") return;

    const currentValues = localFilters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    const newFilters = { ...localFilters, [category]: newValues };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: number) => {
    const newFilters = { ...localFilters, priceRange: [0, value] as [number, number] };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      priceRange: [0, 3000] as [number, number],
      types: [],
      transmission: [],
      fuel: [],
      seats: [],
      features: [],
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFilterCount =
    localFilters.types.length +
    localFilters.transmission.length +
    localFilters.fuel.length +
    localFilters.seats.length +
    localFilters.features.length;

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-80 space-y-4 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h2>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Price */}
      <div className="filter-section">
        <h3 className="filter-title">
          <DollarSign size={20} className="text-primary" />
          Price Range (per day)
        </h3>

        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="3000"
            value={localFilters.priceRange[1]}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="range-slider"
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">₹0</span>
            <span className="text-primary font-semibold">₹{localFilters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Vehicle Type */}
      <div className="filter-section">
        <h3 className="filter-title">
          <Car size={20} className="text-primary" />
          Vehicle Type
        </h3>

        {vehicleTypes.map((type) => (
          <label key={type} className="filter-checkbox">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={localFilters.types.includes(type)}
                onChange={() => handleCheckboxChange("types", type)}
              />
              <span className="capitalize">{type}</span>
            </div>

            <span className="text-xs text-muted-foreground">
              ({vehicleCounts[type] ?? vehicles.filter((v) => v.category === type).length})
            </span>
          </label>
        ))}
      </div>

      {/* Transmission */}
      <div className="filter-section">
        <h3 className="filter-title">
          <Settings size={20} className="text-primary" />
          Transmission
        </h3>

        {transmissionTypes.map((type) => (
          <label key={type} className="filter-checkbox">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={localFilters.transmission.includes(type)}
                onChange={() => handleCheckboxChange("transmission", type)}
              />
              <span>{type}</span>
            </div>
          </label>
        ))}
      </div>

      {/* Fuel */}
      <div className="filter-section">
        <h3 className="filter-title">
          <Fuel size={20} className="text-primary" />
          Fuel Type
        </h3>

        {fuelTypes.map((fuel) => (
          <label key={fuel} className="filter-checkbox">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={localFilters.fuel.includes(fuel)}
                onChange={() => handleCheckboxChange("fuel", fuel)}
              />
              <span>{fuel}</span>
            </div>
          </label>
        ))}
      </div>

      {/* Seats */}
      <div className="filter-section">
        <h3 className="filter-title">
          <Users size={20} className="text-primary" />
          Seats
        </h3>

        {seatOptions.map((s) => (
          <label key={s} className="filter-checkbox">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={localFilters.seats.includes(s)}
                onChange={() => handleCheckboxChange("seats", s)}
              />
              <span>{s}</span>
            </div>
          </label>
        ))}
      </div>

      {/* Features */}
      <div className="filter-section">
        <h3 className="filter-title">
          <Star size={20} className="text-primary" />
          Features
        </h3>

        {featureOptions.map((feature) => (
          <label key={feature} className="filter-checkbox">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={localFilters.features.includes(feature)}
                onChange={() => handleCheckboxChange("features", feature)}
              />
              <span className="text-sm">{feature}</span>
            </div>
          </label>
        ))}
      </div>

      {/* Action */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm pt-4 pb-2 border-t border-border">
        <Button onClick={clearFilters} variant="outline" className="w-full border-border hover:border-primary">
          <RotateCcw size={16} className="mr-2" />
          Clear All Filters
        </Button>
      </div>
    </motion.div>
  );
};

export default FilterSidebar;
