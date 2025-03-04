import { ComponentClass, FunctionComponent } from "react";

export type CustomComponentType<T = unknown> = FunctionComponent<T> | ComponentClass<T> | string;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Provider<T = unknown> = {
  types: CustomComponentType<T>;
  props?: T | null;
  children?: Provider[];
};
