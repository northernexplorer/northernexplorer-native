import { config } from '~/config';

export function getImagePath(path: string) {
  // If it's already a full network URL, leave it alone
  if (path.startsWith('http')) return path;

  // Clean leading slash formatting
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  const serverUrl = config.SERVER_URL;

  return `${serverUrl}/${cleanPath}`;
}
