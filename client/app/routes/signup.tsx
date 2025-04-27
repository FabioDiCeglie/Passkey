import {
  startRegistration
} from '@simplewebauthn/browser';
import type { AuthState } from 'lib/authProvider';
import { AuthContext } from 'lib/authProvider';
import { use } from 'react';
import { useNavigate } from 'react-router';
import { register, verifyRegistration } from '../../lib/api';
import FormComponent from '../components/FormComponent';

export function meta() {
  return [
    { title: 'Passkey project - Sign up' },
    { name: 'description', content: 'Sign up for Passkey project' },
  ];
}

export default function SignUp() {
  const navigate = useNavigate();
  const { error, isLoading, setAuthState } = use(AuthContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setAuthState((prev: AuthState) => ({
        ...prev,
        isLoading: true,
      }));
      const challenge = await register(event);
      const signedChallenge = await startRegistration({optionsJSON: challenge}).catch(
        (err) => {
          console.error(err);
          throw err;
        }
      );

      const verification = await verifyRegistration(
        signedChallenge
      );

      if (verification.verified) {
        setAuthState((prev: AuthState) => ({
          ...prev,
          error: '',
          isLoading: false,
          loggedIn: true,
          username: verification.username,
        }));
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setAuthState((prev: AuthState) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        loggedIn: false,
      }));
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
      error={error}
      isLoading={isLoading}
    />
  );
}
