export function isAdminUser() {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
}
