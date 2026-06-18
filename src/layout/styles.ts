import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
    content: {
        padding: 20,
        gap: 12,
    },
    text: {
        color: "rgba(255,255,255,0.85)",
        fontSize: 16,
        lineHeight: 22,
    },
    paragraph: {
        marginBottom: 12,
        color: "rgba(255,255,255,0.8)",
        fontSize: 16,
        lineHeight: 24,
    },
    heading: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8,
    },
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    darkOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.35)",
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
        width: 320,
        paddingLeft: 20,
        borderLeftWidth: 1,
        borderLeftColor: "rgba(255,255,255,0.1)",
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        color: "white",
        marginBottom: 16,
    },
});