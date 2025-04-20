import {
  startRegistration
} from '@simplewebauthn/browser';
import { useState } from 'react';
import { register, verifyRegistration } from '../../lib/api';
import FormComponent from '../components/FormComponent';
import type { Route } from './+types/home';

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
    try {
      setIsSignedUp((prev) => ({
        ...prev,
        isLoading: true,
      }));
      const challenge = await register(event);
      const signedChallenge = await startRegistration(challenge).catch(
        (err) => {
          console.error(err);
          throw err;
        }
      );

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
      }
    } catch (err) {
      console.error(err);
      setIsSignedUp({
        error: err as string,
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
      isAuthorized={isSignedUp}
    />
  );
}
