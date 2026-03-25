import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components';

export const PerformanceScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Typography variant="h2">Performance</Typography>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
