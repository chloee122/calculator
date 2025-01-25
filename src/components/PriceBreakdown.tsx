import type { DeliveryOrderPrice } from "../types/internal";
import { convertCentToEuroString } from "../utils/convertEuroCurrencyUnit";
import {
  CourierIcon,
  Heading,
  PriceBreakdownContainer,
  PriceItem,
  SkeletonItem,
} from "./styles/PriceBreakdown.styled";

interface PriceBreakdownProps {
  deliveryOrderPrice: DeliveryOrderPrice;
  isCalculating: boolean;
}

function PriceBreakdown({
  deliveryOrderPrice,
  isCalculating,
}: PriceBreakdownProps) {
  const priceItems = [
    {
      label: "Cart Value",
      value: deliveryOrderPrice.cartValue,
      unit: "€",
    },
    {
      label: "Delivery Fee",
      value: deliveryOrderPrice.deliveryFee,
      unit: "€",
    },
    {
      label: "Distance",
      value: deliveryOrderPrice.deliveryDistance,
      unit: "m",
    },
    {
      label: "Small Order Surcharge",
      value: deliveryOrderPrice.smallOrderSurcharge,
      unit: "€",
    },
    {
      label: "Total",
      value: deliveryOrderPrice.totalPrice,
      unit: "€",
    },
  ];

  const skeletonLoadingItems = (
    <div aria-label="Loading price breakdown">
      {Array.from({ length: priceItems.length }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </div>
  );

  const priceBreakdownItems = priceItems.map((item) => {
    const value =
      item.label === "Distance"
        ? item.value
        : convertCentToEuroString(item.value);
    return (
      <PriceItem key={item.label}>
        {item.label}: <span data-raw-value={item.value}>{value}</span>{" "}
        {item.unit}
      </PriceItem>
    );
  });

  return (
    <PriceBreakdownContainer aria-live="polite" aria-atomic="true">
      <Heading>
        <CourierIcon aria-hidden="true" />
        Price Breakdown
      </Heading>
      {isCalculating ? skeletonLoadingItems : priceBreakdownItems}
    </PriceBreakdownContainer>
  );
}

export default PriceBreakdown;
