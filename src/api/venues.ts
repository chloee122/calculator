import axios from "axios";

const ROOT_URL = "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues"

export const getStaticVenueInfo = async (venueSlug: string) => {
    const response = await axios.get(`${ROOT_URL}/${venueSlug}/static`);
    return response.data;
}

export const getDynamicVenueInfo = async (venueSlug: string) => {
    const response = await axios.get(`${ROOT_URL}/${venueSlug}/dynamic`);
    return response.data;
}