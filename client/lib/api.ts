export const getChallenge = async (event: React.FormEvent<HTMLFormElement>) => {
    const response = await fetch(`${process.env.API_URL}/register/public-key/challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: new FormData(event.target as HTMLFormElement),
    });
    return response.json();
}