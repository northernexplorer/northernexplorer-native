import React from "react";
import { View, Text } from "react-native";
import { QuotePayload } from "~/home/hooks/useQuote/getQuote";

export function Quote({ data }: { data: QuotePayload }) {
    return (
        <View>
            <Text
                style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 18,
                    lineHeight: 28,
                    textAlign: "center",
                    fontStyle: "italic",
                }}
            >
                "{data.quote}"
            </Text>

            <Text
                style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: 12,
                }}
            >
                — {data.author}
            </Text>
        </View>
    );
}