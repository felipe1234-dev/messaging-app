export type Operator = "<"
    | "<="
    | "=="
    | "!="
    | ">="
    | ">"
    | "array-contains"
    | "in"
    | "not-in"
    | "array-contains-any";

export interface FilterParams {
    wheres?: Array<[field: string, operator: Operator, value: any]>;
    limit?: number;
    startAfter?: string;
}