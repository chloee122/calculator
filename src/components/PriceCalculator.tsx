import { useState } from "react";
import PriceBreakdown from "./PriceBreakdown";
import type { DeliveryOrderPrice } from "../types/internal";
import { OrderDetailsForm } from "./OrderDetailsForm/OrderDetailsForm";

function PriceCalculator() {
  const [deliveryOrderPrice, setDeliveryOrderPrice] =
    useState<DeliveryOrderPrice>({
      cartValue: 0,
      smallOrderSurcharge: 0,
      deliveryFee: 0,
      deliveryDistance: 0,
      totalPrice: 0,
    });

  return (
    <div>
      <h1>Delivery Order Price Calculator</h1>
      <OrderDetailsForm setDeliveryOrderPrice={setDeliveryOrderPrice} />
      <PriceBreakdown deliveryOrderPrice={deliveryOrderPrice} />
    </div>
  );
}

export default PriceCalculator;
