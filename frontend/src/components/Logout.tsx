

export const logout = async () => {
    const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return true;
    } else {
        return false;
    }
}