import type { RegistrationResponseJSON } from "@simplewebauthn/types";
import { fetchWithErrorHandling } from "./helpers";

export const register = async (event: React.FormEvent<HTMLFormElement>) => {
  const username = new FormData(event.target as HTMLFormElement).get('username');
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/register`,
    { method: 'POST', body: JSON.stringify({ username }), credentials: 'include'  },
    "Error during registration"
  );
};

export const verifyRegistration = async (signedChallenge: RegistrationResponseJSON) => {
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/register/complete`,
    { method: 'POST', body: JSON.stringify(signedChallenge), credentials: 'include' },
    "Error during registration verification"
  );
};

export const logout = async () => {
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/logout`,
    { method: 'POST' },
    "Error during logout"
  );
};