interface VenueDeliveryOrderInfoResponse {
    coordinates: number[];
    order_minimum_no_surcharge: number;
    base_price: number;
    distance_ranges: {
        min: number;
        max: number;
        a: number;
        b: number;
    }[]
}

interface VenueDeliveryOrderInfo {
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

export const convertVenueInfoResponse = (venueDeliveryOrderInfoResponse: VenueDeliveryOrderInfoResponse): VenueDeliveryOrderInfo => {
    return {
        venueLatitude: venueDeliveryOrderInfoResponse.coordinates[1],
        venueLongitude: venueDeliveryOrderInfoResponse.coordinates[0],
        orderMinimumNoSurcharge: venueDeliveryOrderInfoResponse.order_minimum_no_surcharge,
        basePrice: venueDeliveryOrderInfoResponse.base_price,
        distanceRanges: venueDeliveryOrderInfoResponse.distance_ranges,
    }

}