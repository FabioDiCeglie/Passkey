import { decode, encode } from './base64url';

export const fetchWithErrorHandling = async <T>(
    url: string,
    options: RequestInit = {},
    errorMessage: string = "API request failed"
): Promise<T> => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`${errorMessage}: Server responded with status ${response.status}`);
        }
        return await response.json() as T;
    } catch (error) {
        console.error(`${errorMessage}:`, error);
        throw error;
    }
};