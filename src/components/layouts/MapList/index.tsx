import { JSX, ReactNode,  useMemo } from "react";
import { List } from "react-virtualized";
import { cn as classNames } from "@/lib/utils";

type MapListType<T = unknown> = {
  data: T[];
  virtualize?: boolean;
  isLoading?: boolean;
  className?: string;
  ListEmptyComponent?: ReactNode;
  PlaceholderComponent?: () => JSX.Element;
  renderItem: (item: T, index: number) => JSX.Element;
  getItemLayout?: () => { width: number; height: number; rowHeight: number };
};

export const MapList = <T,>({
  virtualize = false,
  data,
  renderItem,
  className = "",
  ListEmptyComponent = null,
  PlaceholderComponent,
  isLoading = false,
  getItemLayout,
}: MapListType<T>) => {

  const listContent = useMemo(() => {
    if (isLoading && PlaceholderComponent) {
      return Array.from({ length: 10 }, (_, index) => (
        <PlaceholderComponent key={index} />
      ));
    }

    if (ListEmptyComponent && data.length === 0) {
      return <>{ListEmptyComponent}</>;
    }

    return null;
  }, [isLoading, PlaceholderComponent, ListEmptyComponent, data.length]);

  if (virtualize && getItemLayout) {
    return (
      <ListVirtualized
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        className={className}
        data={data}
        listContent={listContent}
      />
    );
  }

  return (
    <NormalList data={data} renderItem={renderItem} listContent={listContent} />
  );
};

type ListVirtualizedType<T> = {
  data: T[];
  renderItem: (item: T, index: number) => JSX.Element;
  getItemLayout: () => { width: number; height: number; rowHeight: number };
  className: string;
  listContent: ReactNode;
};

const ListVirtualized = <T,>({
  data,
  renderItem,
  getItemLayout,
  className,
  listContent,
}: ListVirtualizedType<T>) => {
  const { width, height, rowHeight } = getItemLayout();

  return (
    <>
      {listContent || (
        <List
          width={width}
          height={height}
          rowCount={data.length}
          rowHeight={rowHeight}
          className={classNames("virtualized-list", className)}
          rowRenderer={({ index, key, style }: any) => (
            <div key={key} style={style}>
              {renderItem(data[index], index)}
            </div>
          )}
        />
      )}
    </>
  );
};

type NormalListType<T> = {
  data: T[];
  renderItem: (item: T, index: number) => JSX.Element;
  listContent: ReactNode;
};

const NormalList = <T,>({
  data,
  renderItem,
  listContent,
}: NormalListType<T>) => (
  <>{listContent || data.map((item, index) => renderItem(item, index))}</>
);
