import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { COLORS } from '../theme';

interface MapMarkerProps {
  type?: 'driver' | 'pickup' | 'drop';
  heading?: number;
  coordinate?: { latitude: number; longitude: number };
}
export const MapMarker: React.FC<MapMarkerProps> = ({ type = 'driver', heading = 0, coordinate }) => {

  const getMarkerColor = () => {
    switch (type) {
      case 'pickup': return COLORS.accent;
      case 'drop': return COLORS.danger;
      default: return COLORS.primary;
    }
  };

  const markerColor = getMarkerColor();

  if (!coordinate) return null;

  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
      <View style={styles.container}>
        {type === 'driver' && (
          <View style={[styles.pulseRing, { backgroundColor: markerColor }]} />
        )}
        <View 
          style={[
            styles.core, 
            { backgroundColor: markerColor, transform: [{ rotate: `${heading}deg` }] }
          ]}
        >
          {type === 'driver' && <View style={styles.directionIndicator} />}
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.2,
    transform: [{ scale: 1.5 }],
  },
  core: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.white,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  directionIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.white,
    marginTop: 1,
  },
});
