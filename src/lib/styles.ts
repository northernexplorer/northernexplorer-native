import { StyleSheet } from "react-native";
import { Platform } from "react-native";

export const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.55)",
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        alignItems: "center",
        width: "100%",
        maxWidth: 900, // key for web/tablet
        alignSelf: "center",
    },
    brand: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        opacity: 0.9,
    },
    hero: {
        marginTop: 40,
    },
    tempPlaceholder: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 84,
        fontWeight: "200",
    },
    conditionPlaceholder: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 20,
        marginTop: 6,
    },
    grid: {
        width: "100%",
        flexDirection: Platform.select({
            web: "row",
            default: "column",
        }),
        gap: 20,
        alignItems: "stretch",
    },
    card: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    label: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
    },
    value: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 16,
        marginTop: 4,
    },
    forecast: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 40,
    },
    forecastItem: {
        alignItems: "center",
    },
    forecastDay: {
        color: "rgba(255,255,255,0.4)",
    },
    forecastTemp: {
        color: "rgba(255,255,255,0.4)",
        marginTop: 4,
        fontSize: 16,
    },
    panel: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        backgroundColor: "rgba(0,0,0,0.6)",
    }
});