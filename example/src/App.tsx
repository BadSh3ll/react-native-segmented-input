import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import OTP from 'react-native-otp-input';

export default function App() {
  const [value, setValue] = React.useState<string | undefined>();
  return (
    <View style={styles.container}>
      <OTP length={6} onChange={setValue} />
      <Text>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
