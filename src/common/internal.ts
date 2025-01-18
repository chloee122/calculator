export interface VenueDeliveryOrderInfo {
    venueLatitude: number;
    venueLongitude: number;
    orderMinimumNoSurcharge: number;
    basePrice: number;
    distanceRanges: {
        min: number;
        max: number;
        a: number;
        b: number;
    }[]
}