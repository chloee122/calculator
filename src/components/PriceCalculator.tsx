import OrderDetails from "./OrderDetails";
import PriceBreakdown from "./PriceBreakdown";

function PriceCalculator() {
  return (
    <div>
      <h1>Delivery Order Price Calculator</h1>
      <OrderDetails />
      <PriceBreakdown />
    </div>
  );
}

export default PriceCalculator;
