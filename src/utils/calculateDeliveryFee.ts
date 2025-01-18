export const calculateDeliveryFee = (
    distanceRanges: {
        min: number;
        max: number;
        a: number;
        b: number;
    }[],
    deliveryDistance: number,
    basePrice: number
): number => {
    const maxRange = distanceRanges[distanceRanges.length - 2];
    let a = maxRange.a;
    let b = maxRange.b;

    for (let i = 0; i < distanceRanges.length; i++) {
        if (deliveryDistance < distanceRanges[i].max) {
            a = distanceRanges[i].a;
            b = distanceRanges[i].b;
            return Math.ceil(basePrice + a + (b * deliveryDistance) / 10);
        }
    }

    return Math.ceil(basePrice + a + (b * deliveryDistance) / 10);
};