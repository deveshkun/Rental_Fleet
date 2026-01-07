import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CheckCircle } from "lucide-react";

const HELMET_PRICE_PER_DAY = 50;
const INSURANCE_PER_DAY = 30;
const GST_PERCENTAGE = 0.18;
const TWO_WHEELER_CATEGORIES = ["bike", "scooty"];

interface BookingModalProps {
  vehicle: any;
  onClose: () => void;
}

const BookingModal: FC<BookingModalProps> = ({ vehicle, onClose }) => {
  const [range, setRange] = useState<DateRange | undefined>();
  const [activeCalendar, setActiveCalendar] = useState<"pickup" | "drop">("pickup");
  const [location, setLocation] = useState("");
  const [addHelmet, setAddHelmet] = useState(false);
  const [addInsurance, setAddInsurance] = useState(false);
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [dropTime, setDropTime] = useState("10:00 AM");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [promoApplied, setPromoApplied] = useState<"success" | "fail" | null>(null);

  /* ------------------ HELPER ------------------ */
  const parseTimeToMs = (time: string) => {
    const [hourMin, meridiem] = time.split(" ");
    let [hours, minutes] = hourMin.split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return (hours * 60 + minutes) * 60 * 1000;
  };

  /* ------------------ CALCULATIONS ------------------ */
  const totalHours =
    range?.from && range?.to
      ? Math.max(
          range.to.getTime() + parseTimeToMs(dropTime) - (range.from.getTime() + parseTimeToMs(pickupTime)),
          0
        ) / (1000 * 60 * 60)
      : 0;

  const fullDays = Math.floor(totalHours / 24);
  const extraHours = Math.round(totalHours % 24);
  const rentalDaysDisplay = `${fullDays} day(s) ${extraHours} hour(s)`;

  const vehicleCost = totalHours * (vehicle.price.daily / 24);
  const helmetCost =
    addHelmet && TWO_WHEELER_CATEGORIES.includes(vehicle.category)
      ? totalHours * (HELMET_PRICE_PER_DAY / 24)
      : 0;
  const insuranceCost = addInsurance ? totalHours * (INSURANCE_PER_DAY / 24) : 0;

  const subtotal = vehicleCost + helmetCost + insuranceCost;
  const gstAmount = subtotal * GST_PERCENTAGE;
  const totalAmount = subtotal + gstAmount - discount;

  const isValid = totalHours > 0 && location.length > 0;

  /* ------------------ DATE SELECTION ------------------ */
  const handleDateSelect = (date?: Date) => {
    if (!date) return;

    if (activeCalendar === "pickup") {
      setRange({ from: date, to: undefined });
      setActiveCalendar("drop");
    } else {
      setRange((prev) => (prev?.from ? { from: prev.from, to: date } : undefined));
    }
  };

  /* ------------------ PROMO ------------------ */
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "RENT50") {
      setDiscount(50);
      setPromoApplied("success");
    } else {
      setDiscount(0);
      setPromoApplied("fail");
    }

    setTimeout(() => setPromoApplied(null), 1000);
  };

  /* ------------------ CONFIRM ------------------ */
  const handleConfirm = () => {
    if (!isValid) {
      setError("Please select pickup, drop date and location.");
      return;
    }
    setConfirmed(true);
  };

  /* ================== CONFIRMATION VIEW ================== */
  if (confirmed) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 w-full max-w-lg md:max-w-xl rounded-xl p-6 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-center mb-1">Booking Confirmed</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Your ride is successfully booked</p>

            <div className="border rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Vehicle</span>
                <span className="font-medium">{vehicle.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup</span>
                <span>{format(range!.from!, "dd MMM yyyy")}, {pickupTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Drop</span>
                <span>{format(range!.to!, "dd MMM yyyy")}, {dropTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span>{rentalDaysDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span>Location</span>
                <span>{location}</span>
              </div>

              <div className="pt-2 border-t space-y-1">
                <div className="flex justify-between">
                  <span>{vehicle.name} × {rentalDaysDisplay}</span>
                  <span>₹{vehicleCost.toFixed(0)}</span>
                </div>

                <AnimatePresence>
                  {helmetCost > 0 && (
                    <motion.div
                      className="flex justify-between"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      <span>Helmet × {rentalDaysDisplay}</span>
                      <span>₹{helmetCost.toFixed(0)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {insuranceCost > 0 && (
                    <motion.div
                      className="flex justify-between"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      <span>Insurance × {rentalDaysDisplay}</span>
                      <span>₹{insuranceCost.toFixed(0)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>₹{gstAmount.toFixed(0)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
              </div>

              <motion.div
                className="flex justify-between font-semibold text-lg pt-2 border-t"
                animate={{ scale: discount > 0 ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <span>Grand Total</span>
                <span>₹{totalAmount.toFixed(0)}</span>
              </motion.div>
            </div>

            <Button className="w-full mt-6" onClick={onClose}>
              Done
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  /* ================== BOOKING FORM VIEW ================== */
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 w-full max-w-lg md:max-w-2xl rounded-xl p-6  shadow-xl grid md:grid-cols-2 gap-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* LEFT */}
          <div className="overflow-y-auto max-h-[70vh]">
            <h2 className="text-2xl font-bold">{vehicle.name}</h2>
            <p className="text-sm text-gray-500 mb-4">₹{vehicle.price.daily}/day</p>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setActiveCalendar("pickup")}
                className={`flex-1 py-2 rounded-md ${activeCalendar === "pickup" ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-600"}`}
              >
                Pickup
              </button>

              <button
                onClick={() => range?.from && setActiveCalendar("drop")}
                disabled={!range?.from}
                className={`flex-1 py-2 rounded-md ${activeCalendar === "drop" ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-600"}`}
              >
                Drop
              </button>
            </div>

            <Calendar
              mode="single"
              selected={activeCalendar === "pickup" ? range?.from : range?.to}
              onSelect={handleDateSelect}
              disabled={(date) =>
                activeCalendar === "drop" && range?.from
                  ? date <= range.from
                  : date < new Date()
              }
              className="rounded-md border"
            />

            {range?.from && range?.to && (
              <p className="text-xs text-gray-500 mt-2">
                {format(range.from, "dd MMM")} → {format(range.to, "dd MMM")} ({rentalDaysDisplay})
              </p>
            )}

            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Pickup Time</label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full border rounded-md p-2 mt-1"
                >
                  <option>08:00 AM</option>
                  <option>10:00 AM</option>
                  <option>12:00 PM</option>
                  <option>02:00 PM</option>
                  <option>04:00 PM</option>
                  <option>06:00 PM</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Drop Time</label>
                <select
                  value={dropTime}
                  onChange={(e) => setDropTime(e.target.value)}
                  className="w-full border rounded-md p-2 mt-1"
                >
                  <option>08:00 AM</option>
                  <option>10:00 AM</option>
                  <option>12:00 PM</option>
                  <option>02:00 PM</option>
                  <option>04:00 PM</option>
                  <option>06:00 PM</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Pickup Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded-md p-2 mt-1"
              >
                <option value="">Select location</option>
                <option>Noida</option>
                <option>Ghaziabad</option>
                <option>Delhi</option>
              </select>
            </div>

            {TWO_WHEELER_CATEGORIES.includes(vehicle.category) && (
              <div className="mt-4 border rounded-lg p-3 flex justify-between">
                <span>Helmet (₹50/day)</span>
                <input
                  type="checkbox"
                  checked={addHelmet}
                  onChange={(e) => setAddHelmet(e.target.checked)}
                />
              </div>
            )}

            <div className="mt-4 border rounded-lg p-3 flex justify-between">
              <span>Insurance (₹30/day)</span>
              <input
                type="checkbox"
                checked={addInsurance}
                onChange={(e) => setAddInsurance(e.target.checked)}
              />
            </div>

            {/* PROMO CODE */}
            <motion.div
              className="mt-4 flex flex-col items-center w-full"
              animate={{
                scale: promoApplied ? [1, 1.05, 1] : 1,
                borderColor:
                  promoApplied === "success"
                    ? "#16a34a"
                    : promoApplied === "fail"
                    ? "#dc2626"
                    : "#d1d5db",
              }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className={`w-full border rounded-md p-2 outline-none`}
              />
              <Button onClick={handleApplyPromo} className="mt-2 text-sm py-1.5 px-4">
                Apply
              </Button>

              {promoApplied === "success" && (
                <motion.p
                  className="text-green-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  Promo applied!
                </motion.p>
              )}
              {promoApplied === "fail" && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  Invalid code
                </motion.p>
              )}
            </motion.div>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </div>

          {/* RIGHT SUMMARY */}
          <div className="border rounded-lg p-4 flex flex-col justify-between h-full">
            <div className="space-y-2 overflow-auto max-h-[70vh]">
              <motion.div
                className="flex justify-between"
                layout
              >
                <span>{vehicle.name} × {rentalDaysDisplay}</span>
                <span>₹{vehicleCost.toFixed(0)}</span>
              </motion.div>

              <AnimatePresence>
                {helmetCost > 0 && (
                  <motion.div
                    className="flex justify-between"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    layout
                  >
                    <span>Helmet × {rentalDaysDisplay}</span>
                    <span>₹{helmetCost.toFixed(0)}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {insuranceCost > 0 && (
                  <motion.div
                    className="flex justify-between"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    layout
                  >
                    <span>Insurance × {rentalDaysDisplay}</span>
                    <span>₹{insuranceCost.toFixed(0)}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div className="flex justify-between text-sm" layout>
                <span>GST (18%)</span>
                <span>₹{gstAmount.toFixed(0)}</span>
              </motion.div>

              <AnimatePresence>
                {discount > 0 && (
                  <motion.div
                    className="flex justify-between text-sm"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    layout
                  >
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="flex justify-between font-semibold text-lg pt-2 border-t"
                animate={{ scale: discount > 0 ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <span>Grand Total</span>
                <span>₹{totalAmount.toFixed(0)}</span>
              </motion.div>
            </div>

            <Button className="w-full mt-4" disabled={!isValid} onClick={handleConfirm}>
              Confirm Booking
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
