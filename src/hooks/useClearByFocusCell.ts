import { type MouseEvent, useRef } from 'react';
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  Platform,
} from 'react-native';
interface Layout {
  x: number;
  y: number;
  xEnd: number;
  yEnd: number;
}

interface LayoutsMap {
  [cellIndex: string]: Layout;
}

interface Coords {
  locationX: number;
  locationY: number;
}
type PositionType = {
  start: number;
  end: number;
};
const findIndex = (
  { locationX, locationY }: Coords,
  map: LayoutsMap
): number => {
  for (const [index, { x, y, xEnd, yEnd }] of Object.entries(map)) {
    if (
      x < locationX &&
      locationX < xEnd &&
      y < locationY &&
      locationY < yEnd
    ) {
      return parseInt(index, 10);
    }
  }

  return -1;
};

interface Options {
  setValue(text: string): void;
  value?: string;
  setPosition(position: PositionType): void;
  rememberedValue?: string | undefined;
  setRememberedValue(value: string | undefined): void;
}

type HookResult = [
  { onPressOut: (event: GestureResponderEvent) => void },
  (index: number) => (event: LayoutChangeEvent) => void,
];

export const useClearByFocusCell = (options: Options): HookResult => {
  const valueRef = useRef<Options>(options);
  const cellsLayouts = useRef<LayoutsMap>({});

  valueRef.current = options;

  const clearCodeByCoords = (coords: Coords) => {
    const index = findIndex(coords, cellsLayouts.current);

    if (index !== -1) {
      const {
        value,
        setValue,
        setPosition,
        rememberedValue,
        setRememberedValue,
      } = valueRef.current;
      if (value?.length === 0) return;
      // const text = (value || '').slice(0, index);
      let text = value || '';
      // If there is a '*' in the value, replace it to the memorized value or '-'
      if (text.includes('*')) text = text.replace('*', rememberedValue || '-');
      // Remember the current value
      setRememberedValue(text.charAt(index));
      // Replace the char at the index with '*'
      text = text.slice(0, index) + '*' + text.slice(index + 1);
      setPosition({ start: index, end: index });
      setValue(text);
    }
  };

  const getCellOnLayoutHandler =
    (index: number) => (event: LayoutChangeEvent) => {
      const { width, height, x, y } = event.nativeEvent.layout;

      cellsLayouts.current[`${index}`] = {
        x,
        xEnd: x + width,
        y,
        yEnd: y + height,
      };
    };

  const onPressOut = (event: GestureResponderEvent) =>
    clearCodeByCoords(event.nativeEvent);

  // For support react-native-web
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    // @ts-expect-error: not types for getClientRects
    const [offset] = event.target.getClientRects() as [
      { left: number; top: number },
    ];
    const locationX = event.clientX - offset.left;
    const locationY = event.clientY - offset.top;

    clearCodeByCoords({ locationX, locationY });
  };

  return [
    // @ts-expect-error: for web support
    // useMemo(
    Platform.select({ web: { onClick }, default: { onPressOut } }),
    // [Platform.OS]
    // ),
    getCellOnLayoutHandler,
  ];
};
