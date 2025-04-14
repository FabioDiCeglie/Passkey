import { buildLoginOptionsWithUserCredentials, fetchWithErrorHandling, type ChallengeResponse } from "./helpers";

export const getChallenge = async (event: React.FormEvent<HTMLFormElement>): Promise<ChallengeResponse> => {
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/register/public-key/challenge`,
    {
      method: 'POST',
      body: new FormData(event.target as HTMLFormElement),
    },
    "Error getting challenge"
  );
};

export const loginWithUserCredentials = async (userCredentials: Credential) => {
  const options = await buildLoginOptionsWithUserCredentials(userCredentials);
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/login/public-key`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    },
    "Error during login with credentials"
  );
};

export const logout = async () => {
  return fetchWithErrorHandling(
    `${import.meta.env.VITE_API_URL}/logout`,
    { method: 'POST' },
    "Error during logout"
  );
};