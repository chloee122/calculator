import { VenueDeliveryOrderInfo } from "../types/internal";

export const calculateDeliveryFee = (
  distanceRanges: VenueDeliveryOrderInfo["distanceRanges"],
  deliveryDistance: number,
  basePrice: number
): number => {
  for (let i = 0; i < distanceRanges.length; i++) {
    if (deliveryDistance >= 0 && deliveryDistance < distanceRanges[i].max) {
      const { a, b } = distanceRanges[i];
      return Math.ceil(basePrice + a + (b * deliveryDistance) / 10);
    }
  }
  throw new Error("The location is outside of the delivery range.");
};
