export type FormField = {
    label: string;
    inputType: string;
    id: keyof OrderDetailsFormState;
};

export interface OrderDetailsFormState {
    venueSlug: string;
    cartValue: number | null;
    userLatitude: number | null;
    userLongitude: number | null;
}

export enum OrderDetailsFormActionKind {
    HANDLE_STRING_INPUT = "handle_string_input",
    HANDLE_NUMBER_INPUT = "handle_number_input"
}

interface OrderDetailsFormStringInputAction {
    type: OrderDetailsFormActionKind.HANDLE_STRING_INPUT;
    field: string;
    payload: string;
}

interface OrderDetailsFormNumberInputAction {
    type: OrderDetailsFormActionKind.HANDLE_NUMBER_INPUT;
    field: string;
    payload: null | number;
}

export type OrderDetailsFormAction = OrderDetailsFormStringInputAction | OrderDetailsFormNumberInputAction;