import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({

    hero: {
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
    panel: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        backgroundColor: "rgba(0,0,0,0.6)",
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
    forecastSection: {
        marginTop: 30,
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    sidebar: {
        width: Platform.OS === "web" ? 320 : "100%",
        padding: 20,
        borderTopWidth: Platform.OS === "web" ? 0 : 1,
        borderLeftWidth: Platform.OS === "web" ? 1 : 0,
        borderColor: "rgba(255,255,255,0.1)",
    },
    metric: { color: "#aaa" },
    heroRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 32,
        width: "100%",
    },
    weatherSection: {
        flex: 1,
        minWidth: 0,
    },
    quoteSection: {
        width: 320,
        marginHorizontal: 32,
    },
    lunarSection: {
        width: 160,
    },
    mobileSection: {
        width: "100%",
        marginHorizontal: 0,
        marginTop: 20,
    },
    mobileHeroRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    mobileLunarSection: {
        width: 140,
        marginLeft: 16,
    },
    mobileQuoteSection: {
        marginTop: 20,
    },
});