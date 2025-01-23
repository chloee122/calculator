import { getDistance } from "geolib";

export const calculateDeliveryDistance = (
  venueCoordinates: { latitude: number; longitude: number },
  userCoordinates: { latitude: number; longitude: number }
): number => {
  return getDistance(venueCoordinates, userCoordinates, 1);
};
