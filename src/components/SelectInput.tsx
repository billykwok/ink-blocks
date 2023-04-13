import { type FC, useMemo, useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import figures from 'figures';

export type Renderer = (selected: boolean) => JSX.Element;

export type Item<T extends string | number | Renderer> = {
  key: symbol | string | number;
  value: T;
  enabled?: boolean;
};

export const enum Mode {
  LINEAR,
  CIRCULAR_NAVIGATION,
  CIRCULAR_LIST,
}

export type IndicatorProps = { selected: boolean };

export const Indicator = ({ selected }: IndicatorProps) =>
  selected ? <Text color="blue">{figures.pointer}</Text> : <Text> </Text>;

export type ItemLayoutProps = {
  indicator: JSX.Element;
  content: JSX.Element | string;
};

export const ItemLayout = ({ indicator, content }: ItemLayoutProps) => (
  <Box>
    <Box marginRight={1}>{indicator}</Box>
    {content}
  </Box>
);

export type ItemViewProps<T extends string | number | Renderer> = Item<T> & {
  selected: boolean;
};

export const ItemView = <T extends string | number | Renderer>({
  value,
  enabled = true,
  selected,
}: ItemViewProps<T>) => (
  <ItemLayout
    indicator={<Indicator selected={selected} />}
    content={
      <Text color={selected ? 'blue' : undefined} dimColor={!enabled}>
        {typeof value === 'function' ? value(selected) : value}
      </Text>
    }
  />
);

export type SelectInputProps<T extends string | number | Renderer> = {
  items: Item<T>[];
  focus?: boolean;
  initialIndex?: number;
  limit?: number;
  mode?: Mode;
  itemView?: FC<Item<T> & { children?: JSX.Element; selected: boolean }>;
  onSubmit?: (item: Item<T>) => void;
  onSelect?: (item: Item<T>) => void;
};

const mod = (n: number, m: number) => (m ? ((n % m) + m) % m : n);

export function SelectInput<T extends string | number | Renderer>({
  items,
  focus = true,
  initialIndex = 0,
  limit: limit$,
  mode = Mode.CIRCULAR_NAVIGATION,
  itemView: ItemView$ = ItemView,
  onSubmit = () => {},
  onSelect = () => {},
}: SelectInputProps<T>) {
  const [count, limit, overflow] = useMemo(() => {
    const count = items.length;
    const limit = limit$ ? Math.min(limit$, count) : count;
    return [count, limit, count - limit];
  }, [limit$, items.length]);
  const [currentIndex, setIndex] = useState(() => initialIndex);
  const [rotation, setRotation] = useState(() => mod(initialIndex, overflow));
  const findClosestEnabled = useCallback(
    (
      index: number,
      direction: 1 | -1,
      callback: (distance: number) => void
    ) => {
      for (
        let i = index + direction;
        i > index - count && i < index + count;
        i += direction
      ) {
        const { enabled = true } = items[mod(i, count)];
        if (enabled) {
          const distance = i - index;
          callback(distance);
          const updatedIndex = mod(index + distance, count);
          setIndex(updatedIndex);
          onSelect(items[updatedIndex]);
          break;
        }
      }
    },
    [items, count]
  );
  useInput(
    (_input, key) => {
      if (key.upArrow || (key.shift && key.tab)) {
        if (mode >= Mode.CIRCULAR_NAVIGATION || currentIndex > 0) {
          findClosestEnabled(currentIndex, -1, (distance) => {
            if (mod(currentIndex - rotation, count) === 0) {
              setRotation(
                mode >= Mode.CIRCULAR_LIST || rotation > 0
                  ? mod(rotation + distance, count)
                  : overflow
              );
            }
          });
        }
      } else if (key.downArrow || (!key.shift && key.tab)) {
        if (mode >= Mode.CIRCULAR_NAVIGATION || currentIndex < count - 1) {
          findClosestEnabled(currentIndex, 1, (distance) => {
            if (mod(currentIndex - rotation, count) === limit - 1) {
              setRotation(
                mode >= Mode.CIRCULAR_LIST || rotation < overflow
                  ? mod(rotation + distance, count)
                  : 0
              );
            }
          });
        }
      } else if (key.return) {
        onSubmit(items[currentIndex]);
      }
    },
    { isActive: focus }
  );
  const visibleItems = useMemo(() => {
    if (!overflow) {
      return items;
    }
    if (mode >= Mode.CIRCULAR_LIST) {
      const copied = items.slice();
      return copied.splice(rotation).concat(copied).slice(0, limit);
    }
    const start = Math.min(rotation, overflow);
    return items.slice(start, start + limit);
  }, [items, mode, limit, rotation]);

  return (
    <Box flexDirection="column">
      {visibleItems.map(({ key, ...item }, i) => (
        <ItemView$
          {...item}
          key={key.toString()}
          selected={mod(i + rotation, count) === currentIndex}
        />
      ))}
    </Box>
  );
}
