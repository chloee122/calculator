import { useState } from "react";
import OrderDetails from "./OrderDetails";
import PriceBreakdown from "./PriceBreakdown";
import { DeliveryOrderPrice } from "../common/internal";

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
      <OrderDetails setDeliveryOrderPrice={setDeliveryOrderPrice} />
      <PriceBreakdown deliveryOrderPrice={deliveryOrderPrice} />
    </div>
  );
}

export default PriceCalculator;
