import { FieldError, useFormContext } from "react-hook-form";
import { AnimatePresence } from "motion/react";
import type { FormField } from "./OrderDetailsForm";
import InputError from "./InputError";
import { findInputError } from "../../utils/findInputError";

interface InputProps {
  field: FormField;
}

export interface InputError {
  error?: FieldError;
}

function Field({ field }: InputProps) {
  const { label, inputType, id, attribute, defaultValue, placeHolder } = field;
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputError = findInputError(errors, id);
  const isInvalid = Object.keys(inputError).length > 0;

  const preventSpecialCharactersNumberInput = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (id !== "venueSlug" && ["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <div>
        <label htmlFor={id}>{label}</label>
        <AnimatePresence mode="wait" initial={false}>
          {isInvalid && <InputError message={inputError.error?.message} />}
        </AnimatePresence>
      </div>
      <input
        data-test-id={id}
        defaultValue={defaultValue}
        id={id}
        type={inputType}
        min={attribute?.min}
        placeholder={placeHolder}
        {...register(id, {
          required: {
            value: true,
            message: "required",
          },
          validate: {
            checkCartValue: (fieldValue) => {
              if (id !== "cartValue") return;
              return (
                Number(fieldValue) > 0 || "Cart value must be more than 0 EUR"
              );
            },
          },
        })}
        onKeyDown={preventSpecialCharactersNumberInput}
        aria-invalid={errors[id] ? "true" : "false"}
      />
    </div>
  );
}

export default Field;
