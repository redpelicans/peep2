import { propEq } from "ramda";

export const isVacation = propEq("type", "VACATION");
