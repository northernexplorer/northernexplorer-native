import React from "react";
import { View, Text } from "react-native";
import {FieldNoteType} from "~/state/hooks/fieldNote/getFieldNote";

export function FieldNote({ data }: { data: FieldNoteType }) {
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
                "{data.title}"
            </Text>

            <Text
                style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: 12,
                }}
            >
                — {data.body}
            </Text>
        </View>
    );
}