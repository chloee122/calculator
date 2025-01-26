import { VenueDeliveryOrderInfo } from "../types/internal";

export const calculateDeliveryFee = (
  distanceRanges: VenueDeliveryOrderInfo["distanceRanges"],
  deliveryDistance: number,
  basePrice: number
): number => {
  for (let i = 0; i < distanceRanges.length; i++) {
    if (deliveryDistance >= 0 && deliveryDistance < distanceRanges[i].max) {
      const { a, b } = distanceRanges[i];
      return basePrice + a + Math.round((b * deliveryDistance) / 10);
    }
  }
  throw new Error(`The delivery distance is too long (${deliveryDistance} m).`);
};
