import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Home,
  ChevronRight,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Search,
  ChevronLeft,
  X,
} from "lucide-react";

import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import FilterSidebar from "@/components/FilterSidebar";
import VehicleCard from "@/components/VehicleCard";
import QuickViewModal from "@/components/QuickViewModal";
import { Button } from "@/components/ui/button";
import { vehicles, Vehicle } from "@/data/vehicles";

const ITEMS_PER_PAGE = 6;

const Cars = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    priceRange: [0, 3000] as [number, number],
    types: [] as string[],
    transmission: [] as string[],
    fuel: [] as string[],
    seats: [] as string[],
    features: [] as string[],
  });

  // ✅ vehicle counts
  const vehicleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach((v) => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return counts;
  }, []);

  // ✅ filtering
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (
        searchQuery &&
        !vehicle.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // price
      if (
        vehicle.price.daily < filters.priceRange[0] ||
        vehicle.price.daily > filters.priceRange[1]
      ) {
        return false;
      }

      // type
      if (filters.types.length > 0 && !filters.types.includes(vehicle.category)) {
        return false;
      }

      // transmission
      if (
        filters.transmission.length > 0 &&
        !filters.transmission.includes(vehicle.specs.transmission)
      ) {
        return false;
      }

      // fuel
      if (filters.fuel.length > 0 && !filters.fuel.includes(vehicle.specs.fuel)) {
        return false;
      }

      // seats ✅ (your data uses passengers)
      if (filters.seats.length > 0) {
        const s = vehicle.specs.passengers;

        const seatMatch = filters.seats.some((seat) => {
          if (seat === "2 seats") return s === 2;
          if (seat === "4 seats") return s === 4;
          if (seat === "5 seats") return s === 5;
          if (seat === "7+ seats") return s >= 7;
          return false;
        });

        if (!seatMatch) return false;
      }

      // features
      if (filters.features.length > 0) {
        const hasAll = filters.features.every((f) => vehicle.features.includes(f));
        if (!hasAll) return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  // ✅ sorting (fixed)
  const sortedVehicles = useMemo(() => {
    const sorted = [...filteredVehicles];

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price.daily - b.price.daily);
      case "price-high":
        return sorted.sort((a, b) => b.price.daily - a.price.daily);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "year":
        return sorted.sort((a, b) => b.year - a.year);
      case "name":
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [filteredVehicles, sortBy]);

  // ✅ pagination
  const totalPages = Math.ceil(sortedVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = sortedVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleQuickView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const activeFilterCount =
    filters.types.length +
    filters.transmission.length +
    filters.fuel.length +
    filters.seats.length +
    filters.features.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 3000 ? 1 : 0);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Home size={16} />
                  Home
                </Link>
              </li>
              <ChevronRight size={16} className="text-muted-foreground" />
              <li className="text-primary font-medium">Rides</li>
            </ol>
          </motion.nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:block lg:w-80 flex-shrink-0">
              <div className="sticky top-28">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  vehicleCounts={vehicleCounts}
                />
              </div>
            </aside>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsFilterOpen(false)}
                    className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                  />
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 20 }}
                    className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-card z-50 overflow-y-auto p-6"
                  >
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={setFilters}
                      onClose={() => setIsFilterOpen(false)}
                      vehicleCounts={vehicleCounts}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">
                  Available <span className="text-gradient">Rides</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  {sortedVehicles.length} vehicles found
                </p>
              </motion.div>

              {/* Controls */}
              <div className="glass-card p-4 rounded-xl mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => setIsFilterOpen(true)}
                      className="lg:hidden border-border hover:border-primary relative"
                    >
                      <SlidersHorizontal size={18} className="mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>

                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Search vehicles..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:border-primary outline-none transition-colors"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* View + Sort */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex gap-1 bg-secondary rounded-lg p-1">
                      <button
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "grid"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setViewMode("grid")}
                      >
                        <LayoutGrid size={18} />
                      </button>
                      <button
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "list"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setViewMode("list")}
                      >
                        <List size={18} />
                      </button>
                    </div>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-secondary text-foreground px-4 py-2 rounded-lg border border-border focus:border-primary outline-none cursor-pointer"
                    >
                      <option value="name">Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="year">Year: Newest</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid/List */}
              {paginatedVehicles.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {paginatedVehicles.map((vehicle, index) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      viewMode={viewMode}
                      index={index}
                      onQuickView={handleQuickView}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                    No vehicles found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting filters or clear all.
                  </p>

                  <Button
                    onClick={() =>
                      setFilters({
                        priceRange: [0, 3000],
                        types: [],
                        transmission: [],
                        fuel: [],
                        seats: [],
                        features: [],
                      })
                    }
                    className="btn-primary"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-lg bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-lg bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <QuickViewModal
        vehicle={selectedVehicle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Cars;
