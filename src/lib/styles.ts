import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    hero: {
        marginTop: 32,
        width: "100%",
    },

    section: {
        marginTop: 20,
        width: "100%",
    },
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    inner: {
        width: "100%",
        maxWidth: 1100,
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
    brand: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        opacity: 0.9,
    },
    panel: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    glassCard: {
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
    },
    city: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 18,
    },
    temp: {
        color: "white",
        fontSize: 86,
        fontWeight: "200",
        letterSpacing: -2,
    },
    condition: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 16,
        marginTop: 6,
    },
    hourTile: {
        width: 80,
        padding: 12,
        marginRight: 10,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.06)",
        alignItems: "center",
    },

    hourDay: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
    },

    hourTemp: {
        color: "white",
        fontSize: 18,
        marginTop: 6,
    },
    heroSection: {
        marginTop: 60,
    },

    forecastSection: {
        marginTop: 30,
        width: '100%',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: -1,
        pointerEvents: "none",
    },
    vignette: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.2)",
        zIndex: -1,
        pointerEvents: "none",
    },
    page: {
        flex: 1,
        flexDirection: Platform.OS === "web" ? "row" : "column",
    },
    main: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    sidebar: {
        width: Platform.OS === "web" ? 320 : "100%",
        padding: 20,

        borderTopWidth: Platform.OS === "web" ? 0 : 1,
        borderLeftWidth: Platform.OS === "web" ? 1 : 0,

        borderColor: "rgba(255,255,255,0.1)",
    },
});