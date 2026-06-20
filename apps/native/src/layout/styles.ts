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
        marginBottom: 14,
        color: "rgba(255,255,255,0.78)",
        fontSize: 16,
        lineHeight: 28,
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
        paddingLeft: 24,
        paddingTop: 20,
        borderLeftWidth: 1,
        borderLeftColor: "rgba(255,255,255,0.08)",
        backgroundColor: "rgba(15,20,30,0.15)",
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "white",
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    navbarContainer: {
        width: "100%",
        backgroundColor: "rgba(15,20,30,0.45)",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.08)",
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
        gap: 4,
        padding: 4,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.04)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 8,
    },
    activeItem: {
        backgroundColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
    },
    menuText: {
        color: "rgba(255,255,255,0.72)",
        fontSize: 15,
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
        width: 300,
        height: "100%",
        backgroundColor: "rgba(15,20,30,0.8)",
        borderRightWidth: 1,
        borderRightColor: "rgba(255,255,255,0.08)",
        paddingHorizontal: 24,
        gap: 28,
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