import { ComponentClass, ComponentProps, ComponentType, FunctionComponent, JSXElementConstructor } from "react";

export type CustomComponentType<T = unknown> = JSXElementConstructor<T> | ComponentType<T>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Providers = {
  types: CustomComponentType<any>;
  props: ComponentProps<CustomComponentType<any>> | null | undefined;
  children?: Providers[];
};
