import type { Route } from './+types/home';
import FormComponent from '../components/FormComponent';
import { useState } from 'react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { register, verifyRegistration } from '../../lib/api';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Passkey project - Sign up' },
    { name: 'description', content: 'Sign up for Passkey project' },
  ];
}

export default function SignUp() {
  const [isSignedUp, setIsSignedUp] = useState({
    error: '',
    isLoading: false,
    verified: false,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const challenge = await register(event);
    // @ts-ignore
    const signedChallenge = await startRegistration(challenge).catch((err) => {
      console.error(err);
      throw err;
    });

    const verification: { verified: boolean } = await verifyRegistration(
      signedChallenge
    );

    if (verification.verified) {
      setIsSignedUp({
        error: '',
        isLoading: false,
        verified: true,
      });
      window.location.href = '/';
    } else {
      setIsSignedUp({
        error: 'Registration failed',
        isLoading: false,
        verified: false,
      });
    }
  };

  return (
    <FormComponent
      title='Sign up'
      buttonText='Sign up'
      linkText='Log in'
      linkHref='/login'
      linkPrompt='Already have an account?'
      handleSubmit={handleSubmit}
    />
  );
}
