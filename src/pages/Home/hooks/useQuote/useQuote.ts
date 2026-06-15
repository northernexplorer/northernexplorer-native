import { useEffect, useState } from "react";
import { getQuote, type QuotePayload } from "./getQuote";

export function useQuote() {
    const [data, setData] = useState<QuotePayload | null>(null);

    useEffect(() => {
        (async () => {
            const quote = await getQuote();
            setData(quote);
        })();
    }, []);

    return data;
}