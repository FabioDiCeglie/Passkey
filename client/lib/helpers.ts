export const fetchWithErrorHandling = async <T>(
    url: string,
    options: RequestInit = {},
    errorMessage: string = "API request failed"
): Promise<T> => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const resp = await response.json();
            throw resp.error;
        }
        return await response.json() as T;
    } catch (error) {
        console.error(`${errorMessage}:`, error);
        throw error;
    }
};