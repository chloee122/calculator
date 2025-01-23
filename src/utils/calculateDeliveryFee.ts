import { VenueDeliveryOrderInfo } from "../types/internal";

export const calculateDeliveryFee = (
    distanceRanges: VenueDeliveryOrderInfo["distanceRanges"],
    deliveryDistance: number,
    basePrice: number
): { distanceOutOfDeliveryRange: boolean, deliveryFee: number } => {
    let distanceOutOfDeliveryRange = true;

    for (let i = 0; i < distanceRanges.length; i++) {
        // why remove deliveryDistance > 0 check?
        // To-do: Double check deliveryDistance < 0?
        if (deliveryDistance < distanceRanges[i].max) {
            const { a, b } = distanceRanges[i];

            distanceOutOfDeliveryRange = false;
            return { distanceOutOfDeliveryRange, deliveryFee: Math.ceil(basePrice + a + (b * deliveryDistance) / 10) };
        }
    }

    return { distanceOutOfDeliveryRange, deliveryFee: 0 }
};