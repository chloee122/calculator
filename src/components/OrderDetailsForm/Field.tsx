import { FieldError, useFormContext } from "react-hook-form";
import { AnimatePresence } from "motion/react";
import type { FormField } from "./OrderDetailsForm";
import InputError from "./InputError";
import { findInputError } from "../../utils/findInputError";
import {
  FieldContainer,
  Input,
  Label,
  LabelContainer,
} from "../styles/Field.styled";

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

  const preventSpecialCharactersInNumberInput = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Prevent "e", "E", "+", "-" from being allowed in HTML number input
    if (id !== "venueSlug" && ["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <FieldContainer>
      <LabelContainer>
        <Label htmlFor={id}>{label}</Label>
        <AnimatePresence mode="wait" initial={false}>
          {isInvalid && <InputError message={inputError.error?.message} />}
        </AnimatePresence>
      </LabelContainer>
      <Input
        data-test-id={id}
        defaultValue={defaultValue}
        id={id}
        type={inputType}
        min={attribute?.min}
        placeholder={placeHolder}
        {...register(id, {
          required: {
            value: true,
            message: `${label} is required`,
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
        onKeyDown={preventSpecialCharactersInNumberInput}
        $isInvalid={isInvalid}
        aria-invalid={errors[id] ? "true" : "false"}
      />
    </FieldContainer>
  );
}

export default Field;
