import { VenueDeliveryOrderInfo } from "../common/internal";

export const calculateDeliveryFee = (
    distanceRanges: VenueDeliveryOrderInfo["distanceRanges"],
    deliveryDistance: number,
    basePrice: number
): { distanceOutOfDeliveryRange: boolean, deliveryFee: number } => {
    let distanceOutOfDeliveryRange = true;

    for (let i = 0; i < distanceRanges.length; i++) {
        if (deliveryDistance >= 0 && deliveryDistance < distanceRanges[i].max) {
            const { a, b } = distanceRanges[i];

            distanceOutOfDeliveryRange = false;
            return { distanceOutOfDeliveryRange, deliveryFee: Math.ceil(basePrice + a + (b * deliveryDistance) / 10) };
        }
    }

    return { distanceOutOfDeliveryRange, deliveryFee: 0 }
};