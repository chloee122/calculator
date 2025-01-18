import { VenueDeliveryOrderInfoResponse } from "../common/api.types"
import { VenueDeliveryOrderInfo } from "../common/internal"

export const convertVenueInfoResponse = (venueDeliveryOrderInfoResponse: VenueDeliveryOrderInfoResponse): VenueDeliveryOrderInfo => {
    return {
        venueLatitude: venueDeliveryOrderInfoResponse.coordinates[1],
        venueLongitude: venueDeliveryOrderInfoResponse.coordinates[0],
        orderMinimumNoSurcharge: venueDeliveryOrderInfoResponse.order_minimum_no_surcharge,
        basePrice: venueDeliveryOrderInfoResponse.base_price,
        distanceRanges: venueDeliveryOrderInfoResponse.distance_ranges,
    }

}