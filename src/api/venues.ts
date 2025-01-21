import axios from "axios";
import { convertVenueDeliveryOrderInfoResponse } from "../utils/convertVenueDeliveryOrderInfoResponse";

const ROOT_URL = "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues"

export const getStaticVenueInfo = async (venueSlug: string) => {
    const response = await axios.get(`${ROOT_URL}/${venueSlug}/static`);
    return response.data;
}

export const getDynamicVenueInfo = async (venueSlug: string) => {
    const response = await axios.get(`${ROOT_URL}/${venueSlug}/dynamic`);
    return response.data;
}

export const getVenueDeliveryOrderInfo = async (venueSlug: string) => {
    const staticVenueInfo = await getStaticVenueInfo(venueSlug);
    const dynamicVenueInfo = await getDynamicVenueInfo(venueSlug);

    const { coordinates } = staticVenueInfo.venue_raw.location;
    const {
        order_minimum_no_surcharge,
        delivery_pricing: { base_price, distance_ranges },
    } = dynamicVenueInfo.venue_raw.delivery_specs;

    return convertVenueDeliveryOrderInfoResponse({
        coordinates,
        order_minimum_no_surcharge,
        base_price,
        distance_ranges,
    });
} 
