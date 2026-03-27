import { RideRequest } from '../api/rideService';

/**
 * Decodes Google Maps Encoded Polyline
 */
export const decodePolyline = (t: string) => {
  let points = [];
  let index = 0, len = t.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = t.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = t.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
  }
  return points;
};

/**
 * Maps Backend Booking structure to Frontend RideRequest structure
 */
export const mapBackendToFrontendRide = (backendBooking: any): RideRequest | null => {
  if (!backendBooking) return null;

  const pickup = {
    latitude: backendBooking.pickupLocation?.coordinates?.[1] ?? backendBooking.pickup?.latitude ?? 0,
    longitude: backendBooking.pickupLocation?.coordinates?.[0] ?? backendBooking.pickup?.longitude ?? 0,
    address: backendBooking.pickupLocation?.address ?? backendBooking.pickup?.address ?? ''
  };

  const dropoff = {
    latitude: backendBooking.dropLocation?.coordinates?.[1] ?? backendBooking.dropoff?.latitude ?? 0,
    longitude: backendBooking.dropLocation?.coordinates?.[0] ?? backendBooking.dropoff?.longitude ?? 0,
    address: backendBooking.dropLocation?.address ?? backendBooking.dropoff?.address ?? ''
  };

  // Robust fare mapping
  let fare = { total: 0, baseFare: 0, distanceFare: 0, waitingFare: 0 };
  if (typeof backendBooking.fare === 'number') {
    fare.total = backendBooking.fare;
  } else if (typeof backendBooking.fare === 'object' && backendBooking.fare !== null) {
    fare = {
      total: backendBooking.fare.total ?? 0,
      baseFare: backendBooking.fare.baseFare ?? 0,
      distanceFare: backendBooking.fare.distanceFare ?? 0,
      waitingFare: backendBooking.fare.waitingFare ?? 0,
    };
  }

  return {
    id: backendBooking._id || backendBooking.id,
    riderId: backendBooking.riderId,
    pickup,
    dropoff,
    fare,
    distance: backendBooking.distance || 0,
    duration: backendBooking.duration || 0,
    status: (backendBooking.status?.toLowerCase() || 'pending') as RideRequest['status'],
    riderName: backendBooking.riderName || backendBooking.riderId?.name || 'Rider',
    riderRating: backendBooking.riderRating || 4.8
  } as RideRequest;
};
