import {
    FieldErrors,
    FieldValues,
} from "react-hook-form";
import { InputError } from "../components/OrderDetailsForm/Field";

export const findInputError = (errors: FieldErrors<FieldValues>, id: string): InputError => {
    const filtered = Object.keys(errors)
        .filter((key) => key.includes(id))
        .reduce((cur, key) => {
            return Object.assign(cur, { error: errors[key] });
        }, {});
    return filtered;
};
