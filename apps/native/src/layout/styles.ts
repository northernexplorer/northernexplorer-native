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

    navbarContainer: {
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    navbar: {
        width: "100%",
        paddingHorizontal: 20,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
    },
    desktopNavbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
    },
    mobileNavbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
    },
    brandText: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 20,
        fontWeight: "600",
    },
    hamburger: {
        padding: 4,
    },
    desktopLinks: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        gap: 6,
    },
    activeItem: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
    menuText: {
        color: "rgba(255,255,255,0.85)", // Matches theme text rules perfectly
        fontSize: 16,
    },
    activeText: {
        color: "white",
        fontWeight: "600",
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    drawerContainer: {
        width: 280,
        height: "100%",
        backgroundColor: "rgba(20, 20, 20, 0.95)",
        paddingHorizontal: 20,
        gap: 24,
        borderRightWidth: 1,
        borderRightColor: "rgba(255,255,255,0.1)",
    },
    drawerHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
        paddingBottom: 16,
        marginTop: 12,
    },
    drawerLinks: {
        flexDirection: "column",
        gap: 16,
    },
    drawerMenuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: "100%",
    },
    drawerMenuText: {
        fontSize: 16,
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
    drawerLogo: {
        width: 36,
        height: 36,
        resizeMode: "contain",
    },
    brandContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
});