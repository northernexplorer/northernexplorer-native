export function getUrl({ path, serverUrl }: { path: string; serverUrl: string }) {
    // If it's already a full network URL, leave it alone
    if (path.startsWith('http')) return path;

    // Clean leading slash formatting
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    return `${serverUrl}/${cleanPath}`;
}
