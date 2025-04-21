import type { RegistrationResponseJSON, AuthenticationResponseJSON, PublicKeyCredentialRequestOptionsJSON, PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";
import { fetchWithErrorHandling } from "./helpers";

export const register = async (event: React.FormEvent<HTMLFormElement>): Promise<{optionsJSON: PublicKeyCredentialCreationOptionsJSON}> => {
  const username = new FormData(event.target as HTMLFormElement).get('username');
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/register`,
    { method: 'POST', body: JSON.stringify({ username }), credentials: 'include'  },
    "Error during registration"
  );
};

export const verifyRegistration = async (signedChallenge: RegistrationResponseJSON): Promise<{ verified: boolean }> => {
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/register/complete`,
    { method: 'POST', body: JSON.stringify(signedChallenge), credentials: 'include' },
    "Error during registration verification"
  );
};

export const login = async (event: React.FormEvent<HTMLFormElement>): Promise<{optionsJSON: PublicKeyCredentialRequestOptionsJSON}> => {
  const username = new FormData(event.target as HTMLFormElement).get('username');
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/login`,
    { method: 'POST', body: JSON.stringify({ username }), credentials: 'include'  },
    "Error during registration"
  );
};

export const verifyLogin = async (signedChallenge: AuthenticationResponseJSON): Promise<{ verified: boolean }> => {
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/login/complete`,
    { method: 'POST', body: JSON.stringify(signedChallenge), credentials: 'include' },
    "Error during login verification"
  );
};

export const logout = async (): Promise<{ message: string }> => {
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/logout`,
    { method: 'POST', credentials: 'include' },
    "Error during logout"
  );
};

export const checkSession = async (): Promise<{ loggedIn: boolean; username?: string }> => {
	return fetchWithErrorHandling(
		`${import.meta.env.VITE_API_URL}/auth`,
		{ method: 'GET', credentials: 'include' },
		"Error checking session status"
	);
};