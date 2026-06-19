export function getUrlSafeString(str?: string | number) {
    const forceString = str?.toString() || '';
    const formattedString = forceString.toLowerCase().trim();
    return formattedString
        // 1. Replace spaces, underscores, and slashes with hyphens
        .replace(/[\s_\/]+/g, '-')
        // 2. Remove anything that isn't a lowercase letter, number, or hyphen
        .replace(/[^a-z0-9\-]/g, '')
        // 3. Clean up any accidental double hyphens (e.g., "fort---garry" -> "fort-garry")
        .replace(/-+/g, '-')
        // 4. Ensure it doesn't start or end with a stray hyphen
        .replace(/^-+|-+$/g, '');
}