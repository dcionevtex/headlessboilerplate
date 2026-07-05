export const startAuthentication = async () => {
    try {
        const response = await fetch('/api/auth/start', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) throw new Error(`Failed to start authentication: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error starting authentication:', error);
        throw error;
    }
};

export const sendAccessKeyEmail = async (authenticationToken: string, email: string) => {
    try {
        const response = await fetch('/api/auth/send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authenticationToken, email })
        });

        if (!response.ok) throw new Error(`Failed to send access key: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error sending access key email:', error);
        throw error;
    }
};

export const verifyAccessKey = async (authenticationToken: string, email: string, accessKey: string) => {
    try {
        const response = await fetch('/api/auth/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authenticationToken, email, accessKey })
        });

        // authStatus/success is carried in the body even on non-2xx responses
        // (e.g. WrongCredentials returns 401) - the caller needs that body, not a thrown error.
        return await response.json();
    } catch (error) {
        console.error('Error verifying access key:', error);
        throw error;
    }
};

// Email is derived server-side from the session token itself (see api/account/*),
// not accepted from the caller here - the endpoints ignore any client-supplied email.
export const getProfile = async (sessionToken: string) => {
    try {
        const response = await fetch('/api/account/profile', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionToken}`,
            }
        });

        if (!response.ok) throw new Error(`Failed to fetch profile: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const getOrders = async (sessionToken: string) => {
    try {
        const response = await fetch('/api/account/orders', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionToken}`,
            }
        });

        if (!response.ok) throw new Error(`Failed to fetch orders: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};
