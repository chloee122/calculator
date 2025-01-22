import type { DeliveryOrderPrice } from "../types/internal";
import { convertCentToEuroString } from "../utils/convertEuroCurrencyUnit";

interface PriceBreakdownProps {
  deliveryOrderPrice: DeliveryOrderPrice;
}

function PriceBreakdown({ deliveryOrderPrice }: PriceBreakdownProps) {
  const priceItems = [
    {
      label: "Cart Value",
      value: deliveryOrderPrice.cartValue,
      unit: "EUR",
    },
    {
      label: "Delivery Fee",
      value: deliveryOrderPrice.deliveryFee,
      unit: "EUR",
    },
    {
      label: "Distance",
      value: deliveryOrderPrice.deliveryDistance,
      unit: "m",
    },
    {
      label: "Small Order Surcharge",
      value: deliveryOrderPrice.smallOrderSurcharge,
      unit: "EUR",
    },
    {
      label: "Total",
      value: deliveryOrderPrice.totalPrice,
      unit: "EUR",
    },
  ];
  return (
    <div>
      <h4>Price Breakdown</h4>
      {priceItems.map((item) => {
        const value =
          item.label === "Distance"
            ? item.value
            : convertCentToEuroString(item.value);
        return (
          <div key={item.label}>
            {item.label}: <span data-raw-value={item.value}>{value}</span>{" "}
            {item.unit}
          </div>
        );
      })}
    </div>
  );
}

export default PriceBreakdown;
