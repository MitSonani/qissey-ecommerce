export async function fetchApi(endpoint, options = {}) {
    const token = localStorage.getItem('custom_auth_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorData = {};
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { error: response.statusText };
        }
        throw new Error(errorData.error || 'API request failed');
    }

    // Some responses might be 204 No Content
    if (response.status === 204) {
        return null;
    }

    return response.json();
}
