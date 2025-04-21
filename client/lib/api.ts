import type { RegistrationResponseJSON, AuthenticationResponseJSON, PublicKeyCredentialRequestOptionsJSON, PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";
import { fetchWithErrorHandling } from "./helpers";

export const register = async (event: React.FormEvent<HTMLFormElement>): Promise<PublicKeyCredentialCreationOptionsJSON> => {
  const username = new FormData(event.target as HTMLFormElement).get('username');
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/api/register`,
    { method: 'POST', body: JSON.stringify({ username }), credentials: 'include'  },
    "Error during registration"
  );
};

export const verifyRegistration = async (signedChallenge: RegistrationResponseJSON): Promise<{ verified: boolean }> => {
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/api/register/complete`,
    { method: 'POST', body: JSON.stringify(signedChallenge), credentials: 'include' },
    "Error during registration verification"
  );
};

export const login = async (event: React.FormEvent<HTMLFormElement>): Promise<PublicKeyCredentialRequestOptionsJSON> => {
  const username = new FormData(event.target as HTMLFormElement).get('username');
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/api/login`,
    { method: 'POST', body: JSON.stringify({ username }), credentials: 'include'  },
    "Error during registration"
  );
};

export const verifyLogin = async (signedChallenge: AuthenticationResponseJSON): Promise<{ verified: boolean }> => {
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/api/login/complete`,
    { method: 'POST', body: JSON.stringify(signedChallenge), credentials: 'include' },
    "Error during login verification"
  );
};

export const logout = async (): Promise<{ message: string }> => {
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/api/logout`,
    { method: 'POST', credentials: 'include' },
    "Error during logout"
  );
};

export const checkSession = async (): Promise<{ loggedIn: boolean; username?: string }> => {
	return fetchWithErrorHandling(
		`${import.meta.env.VITE_API_URL}/api/auth`,
		{ method: 'GET', credentials: 'include' },
		"Error checking session status"
	);
};