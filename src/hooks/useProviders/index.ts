import { CustomComponentType, Provider } from "./type";
import { createElement } from "react";

type GetProvider<T> = {
  provider: CustomComponentType<T>;
  props?: T;
  children?: Provider<any>[];
};

export const getProvider = <T>({
  provider,
  props,
  children,
}: GetProvider<T>) => {
  return {
    types: provider,
    props: props,
    children: children ?? [],
  };
};

/**
 * The useEntryPoint function is a custom hook that takes in an object props of type EntryPoint and returns an element based on the provided props.
 * @param props
 * @returns - entryPoint (type: React.ReactElement): The created entry point element.
 *
 * @example
 *   Example Usage:
 * ```
 * const MyComponent = () => {
 *   const entryPointProps = {
 *    types: "div",
 *    props: { className: "my-class" },
 *     children: []
 *    };
 *
 *  const entryPoint = useEntryPoint(entryPointProps);
 *
 *   return entryPoint;
 * };
 * ``
 */
const renderChildrenRecursively = (child?: Provider, index?: number): any => {
  if (!child) return null;

  const childrenElements = child.children?.map((item, idx) => renderChildrenRecursively(item, idx)) ?? [];

  return createElement<any>(
    child.types,
    { ...(child.props ?? {}), key: index },
    ...childrenElements
  );
};

export const useProviders = (props: Provider<any>) => {
  const children = props?.children?.map?.((child, index) => renderChildrenRecursively(child, index)) ?? [];

  return createElement<any>(props.types, props.props, ...children);
};
