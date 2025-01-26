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
  }[];
}

export interface DeliveryOrderPrice {
  cartValue: number;
  smallOrderSurcharge: number;
  deliveryFee: number;
  deliveryDistance: number;
  totalPrice: number;
}
