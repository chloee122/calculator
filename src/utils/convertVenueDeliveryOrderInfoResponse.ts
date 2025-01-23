import { VenueDeliveryOrderInfoResponse } from "../types/api.types";
import { VenueDeliveryOrderInfo } from "../types/internal";

export const convertVenueDeliveryOrderInfoResponse = (
  venueDeliveryOrderInfoResponse: VenueDeliveryOrderInfoResponse
): VenueDeliveryOrderInfo => {
  return {
    venueLatitude: venueDeliveryOrderInfoResponse.coordinates[1],
    venueLongitude: venueDeliveryOrderInfoResponse.coordinates[0],
    orderMinimumNoSurcharge:
      venueDeliveryOrderInfoResponse.order_minimum_no_surcharge,
    basePrice: venueDeliveryOrderInfoResponse.base_price,
    distanceRanges: venueDeliveryOrderInfoResponse.distance_ranges,
  };
};
