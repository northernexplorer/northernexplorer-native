import { Platform } from 'react-native';

export function getImagePath(path: string) {
  // If it's already a full network URL, leave it alone
  if (path.startsWith('http')) return path;

  // Clean leading slash formatting
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (__DEV__) {
    if (Platform.OS === 'web') {
      return `/${cleanPath}`;
    }
    // Native needs your precise dev machine IP address to hit the Metro public bucket
    return `http://192.168.1.201:8081/${cleanPath}`;
  }

  // Production: Point this to your live deployed web server domain
  return `https://northernexplorer.org/${cleanPath}`;
}
