import { useRef, useEffect } from 'react';
import { TextInput } from 'react-native';

interface Options {
  value?: string;
  cellCount: number | 4 | undefined;
}

export const useBlurOnFulfill = ({ value, cellCount }: Options) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (value && value.length === cellCount && !value.includes('*')) {
      const inputInstance = inputRef.current;

      if (inputInstance) {
        inputInstance.blur();
      }
    }
  }, [value, cellCount]);

  return inputRef;
};
