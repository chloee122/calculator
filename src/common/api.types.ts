export interface VenueDeliveryOrderInfoResponse {
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