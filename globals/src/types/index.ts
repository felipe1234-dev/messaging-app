import { operators } from "../constants";

export type Operator = (typeof operators)[number];

export interface FilterParams {
    wheres?: Array<[field: string, operator: Operator, value: any]>;
    limit?: number;
    startAfter?: string;
}
