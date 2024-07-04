import React, { type Dispatch, type FC } from 'react';
import { CodeField } from './CodeField';
import { Cursor } from './Cursor';
import { useBlurOnFulfill } from '../hooks/useBlurOnFulfill';
import { useClearByFocusCell } from '../hooks/useClearByFocusCell';
import { StyleSheet, Text } from 'react-native';

interface Props {
  length?: number;
  onChange: Dispatch<string>;
}
type PositionType = {
  start: number;
  end: number;
};

const OTP: FC<Props> = ({ length = 4, onChange }) => {
  const [value, setValue] = React.useState('');
  const [rememberedValue, setRememberedValue] = React.useState<
    string | undefined
  >(undefined);
  const [selection, setSelection] = React.useState<PositionType>();
  const ref = useBlurOnFulfill({ value, cellCount: length });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
    setPosition: setSelection,
    rememberedValue,
    setRememberedValue,
  });

  const handleChangeText = (text: string) => {
    let newText = text;
    if (text.includes('*')) {
      newText = newText.replace('*', '');
      setSelection({ start: newText.length, end: newText.length });
    }
    onChange(newText.replace('-', ''));
    setValue(newText);
  };

  return (
    <>
      <CodeField
        {...props}
        caretHidden={false}
        selection={selection}
        onSelectionChange={(e) => {
          setSelection(e.nativeEvent.selection);
        }}
        value={value}
        ref={ref}
        cellCount={length}
        onChangeText={handleChangeText}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={'one-time-code'}
        testID="my-code-input"
        renderCell={({ index, symbol, isFocused, isEmpty }) => (
          <Text
            key={index}
            style={[
              styles.cell,
              Boolean(symbol) &&
                symbol !== '-' &&
                symbol !== '*' &&
                styles.valuedCell,
              isFocused && styles.focusCell,
            ]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {isFocused ? <Cursor /> : isEmpty ? null : symbol}
          </Text>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 45,
    lineHeight: 38,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    marginHorizontal: 3,
    overflow: 'hidden',
  },
  valuedCell: {
    backgroundColor: '#fff',
  },
  focusCell: {
    // borderColor: '#000',
    // borderWidth: 1,
  },
});

export default OTP;
