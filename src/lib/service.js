export const baseUrl = import.meta.env.VITE_BACKEND_URL;
export const baseUrlTicket = import.meta.env.VITE_BACKEND_TICKET;

export const postRequest = async (url, body, token = null) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = token;
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body,
    });

    const data = await response.json();

    if (!response.ok) {
        let message;

        if (data.message) {
            message = data.message;
        } else {
            message = data;
        }

        if (response.status === 401) {
            localStorage.removeItem("token");
        }

        return { error: true, message, status: response.status };
    }

    return data;
};

export const getRequest = async (url, token = null) => {
    const headers = {};

    if (token) {
        headers["Authorization"] = token;
    }

    const response = await fetch(url, {
        method: "GET",
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        let message = "An error occured...";

        if (data.message) {
            message = data.message;
        }

        if (response.status === 401) {
            localStorage.removeItem("token");
        }

        return { error: true, message, status: response.status };
    }

    return data;
};
