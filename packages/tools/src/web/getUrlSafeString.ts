export function getUrlSafeString(str?: string | number | null) {
  const forceString = str?.toString() || '';
  const formattedString = forceString.toLowerCase().trim();
  return (
    formattedString
      // Replace spaces, underscores, and slashes with hyphens
      .replace(/[\s_\/]+/g, '-')
      // Remove anything that isn't a lowercase letter, number, or hyphen
      .replace(/[^a-z0-9\-]/g, '')
      // Clean up any accidental double hyphens (e.g., "fort---garry" -> "fort-garry")
      .replace(/-+/g, '-')
      // Ensure it doesn't start or end with a stray hyphen
      .replace(/^-+|-+$/g, '')
  );
}
