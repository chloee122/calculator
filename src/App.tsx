import { ToastContainer, Slide } from "react-toastify";
import PriceCalculator from "./components/PriceCalculator";

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <PriceCalculator />
    </>
  );
}

export default App;
