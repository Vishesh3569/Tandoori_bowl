import { PreorderStatus } from "../types";

export const PREORDER_SCHEDULE = [
  { day: "Monday", time: "11:00 AM - 03:00 PM" },
  { day: "Tuesday", time: "11:00 AM - 03:00 PM" },
  { day: "Wednesday", time: "11:00 AM - 03:00 PM" },
  { day: "Thursday", time: "11:00 AM - 03:00 PM" },
  { day: "Friday", time: "11:00 AM - 03:00 PM" },
  { day: "Saturday", time: "11:00 AM - 03:00 PM" },
  { day: "Sunday", time: "11:00 AM - 03:00 PM" },
];

export function getPreorderStatus(): PreorderStatus {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const openTimeInMinutes = 11 * 60; // 11:00 AM
  const closeTimeInMinutes = 15 * 60; // 03:00 PM

  if (currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes) {
    const minutesLeft = closeTimeInMinutes - currentTimeInMinutes;
    const hours = Math.floor(minutesLeft / 60);
    const mins = minutesLeft % 60;
    return {
      isOpen: true,
      message: `Pre-orders OPEN! Closes in ${hours > 0 ? `${hours}h ` : ""}${mins}m`,
      nextOpenTimeText: "Today closes at 3:00 PM",
    };
  }

  if (currentTimeInMinutes < openTimeInMinutes) {
    return {
      isOpen: false,
      message: "Pre-order for today will open at 11:00 AM",
      nextOpenTimeText: "Opens today at 11:00 AM",
    };
  }

  return {
    isOpen: false,
    message: "Pre-order for today is CLOSED • Opens tomorrow at 11:00 AM",
    nextOpenTimeText: "Opens tomorrow at 11:00 AM",
  };
}