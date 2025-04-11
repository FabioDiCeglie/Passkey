import { buildLoginOptionsWithUserCredentials, fetchWithErrorHandling } from "./helpers";

export const getChallenge = async (event: React.FormEvent<HTMLFormElement>) => {
  return fetchWithErrorHandling(
    `${process.env.API_URL}/register/public-key/challenge`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: new FormData(event.target as HTMLFormElement),
    },
    "Error getting challenge"
  );
};

export const loginWithUserCredentials = async (userCredentials: Credential) => {
  const options = await buildLoginOptionsWithUserCredentials(userCredentials);
  
  return fetchWithErrorHandling(
    `${process.env.API_URL}/login/public-key`,
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