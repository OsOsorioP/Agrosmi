const API_BASE_URL = 'http://TU_IP_LOCAL_O_EMULADOR:8000';

export async function post<T>(endpoint: string, data: any): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`API POST: ${url}`, data);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`API Error: ${response.status} - ${response.statusText}`, errorBody);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        const result: T = await response.json();
        console.log(`API Success: ${url}`, result);
        return result;

    } catch (error: any) {
        console.error(`API Fetch Error: ${error.message}`, error);
        throw new Error(`Failed to fetch from ${url}: ${error.message}`);
    }
}