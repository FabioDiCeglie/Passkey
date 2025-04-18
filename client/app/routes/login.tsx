import { startAuthentication } from '@simplewebauthn/browser';
import { useState } from 'react';
import { login, verifyLogin } from '../../lib/api';
import FormComponent from '../components/FormComponent';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Passkey project - Log in' },
    { name: 'description', content: 'Log in to Passkey project' },
  ];
}

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState({
    error: '',
    isLoading: false,
    verified: false,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const challenge = await login(event);
    // @ts-ignore
    const signedChallenge = await startAuthentication(challenge).catch((err) => {
      console.error(err);
      throw err;
    });

    const verification: { verified: boolean } = await verifyLogin(
      signedChallenge
    );

    if (verification.verified) {
      setIsLoggedIn({
        error: '',
        isLoading: false,
        verified: true,
      });
      window.location.href = '/';
    } else {
      setIsLoggedIn({
        error: 'Login failed',
        isLoading: false,
        verified: false,
      });
    }
  };
  return (
    <FormComponent
      title="Log in"
      buttonText="Log in"
      linkText="Register"
      linkHref="/signup"
      linkPrompt="Don't have an account yet?"
      handleSubmit={handleSubmit}
    />
  );
}
