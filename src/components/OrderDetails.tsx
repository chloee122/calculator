import { useReducer } from "react";

type FormField = {
  label: string;
  inputType: string;
  id: keyof CalculatorFormState;
};

interface CalculatorFormState {
  venueSlug: string;
  cartValue: number;
  userLatitude: number;
  userLongitude: number;
}

const initialFormState: CalculatorFormState = {
  venueSlug: "",
  cartValue: 0,
  userLatitude: 0,
  userLongitude: 0,
};

enum CalculatorFormActionKind {
  HANDLE_INPUT = "handle_input",
}

interface CalculatorFormInputAction {
  type: CalculatorFormActionKind.HANDLE_INPUT;
  field: string;
  payload: string | number;
}

type CalculatorFormAction = CalculatorFormInputAction;

const calculatorFormReducer = (
  state: CalculatorFormState,
  action: CalculatorFormAction
) => {
  if (action.type === CalculatorFormActionKind.HANDLE_INPUT) {
    return { ...state, [action.field]: action.payload };
  }

  return state;
};

function OrderDetails() {
  const [calculatorFormState, dispatch] = useReducer(
    calculatorFormReducer,
    initialFormState
  );

  const formFields: FormField[] = [
    { label: "Venue slug", inputType: "text", id: "venueSlug" },
    { label: "Cart value", inputType: "number", id: "cartValue" },
    { label: "User latitude", inputType: "number", id: "userLatitude" },
    { label: "User longitude", inputType: "number", id: "userLongitude" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    dispatch({
      type: CalculatorFormActionKind.HANDLE_INPUT,
      field: id,
      payload: id === "venueSlug" ? value : Number(value),
    });
  };

  const formFieldContent = formFields.map((field) => {
    return (
      <div key={field.label}>
        <label htmlFor={field.id}>{field.label}</label>
        <input
          value={calculatorFormState[field.id]}
          type={field.inputType}
          id={field.id}
          data-test-id={field.id}
          onChange={handleChange}
        />
      </div>
    );
  });

  const getUserCoordinates = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        dispatch({
          type: CalculatorFormActionKind.HANDLE_INPUT,
          field: "userLatitude",
          payload: latitude,
        });

        dispatch({
          type: CalculatorFormActionKind.HANDLE_INPUT,
          field: "userLongitude",
          payload: longitude,
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  console.log(calculatorFormState);
  return (
    <div>
      <h4>Order Details</h4>
      <form>
        {formFieldContent}
        <button onClick={getUserCoordinates}>Get location</button>
        <button>Calculate delivery fee</button>
      </form>
    </div>
  );
}

export default OrderDetails;
