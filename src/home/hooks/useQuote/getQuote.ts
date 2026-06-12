export interface QuotePayload {
    source: string;
    date: string;
    quote: string;
    author: string;
    usage_count: number;
}

export async function getQuote(): Promise<QuotePayload> {
    const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    if (!serverUrl) throw new Error("EXPO_PUBLIC_SERVER_URL is missing.");

    // Strips trailing slashes and configures the non-coordinate route parameter
    const url = new URL(`${serverUrl.replace(/\/$/, "")}/index.php`);
    url.searchParams.set("type", "quote");

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Quote routing failure status: ${res.status}`);

    return res.json();
}