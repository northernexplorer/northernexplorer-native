import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useApiClient } from '~/core/useApiClient'; // Assuming this is the path

export function useServerConnectivity() {
  const [isDeviceConnected, setIsDeviceConnected] = useState(true);
  const [tick, setTick] = useState(0);

  // Add 'tick' to the params to force re-fetch
  const { data, error } = useApiClient('system', 'StatusController', 'getOnlineStatus', {
    tick,
  });

  useEffect(() => {
    // Listen for device connectivity
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsDeviceConnected(state.isConnected ?? true);
    });

    // Poll every 10 seconds
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Logic: Offline if no device net, API error, or API explicitly says false
  return !isDeviceConnected || !!error || data === false;
}
