import { startAuthentication } from '@simplewebauthn/browser';
import type { AuthState } from 'lib/authProvider';
import { AuthContext } from 'lib/authProvider';
import { use } from 'react';
import { useNavigate } from 'react-router';
import { login, verifyLogin } from '../../lib/api';
import FormComponent from '../components/FormComponent';
export function meta() {
  return [
    { title: 'Passkey project - Log in' },
    { name: 'description', content: 'Log in to Passkey project' },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const { error, isLoading, setAuthState } = use(AuthContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setAuthState((prev: AuthState) => ({
        ...prev,
        isLoading: true,
      }));
      const challenge = await login(event);
      const signedChallenge = await startAuthentication({optionsJSON: challenge}).catch(
        (err) => {
          console.error(err);
          throw err;
        }
      );

      const verification = await verifyLogin(
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
      title='Log in'
      buttonText='Log in'
      linkText='Register'
      linkHref='/signup'
      linkPrompt="Don't have an account yet?"
      handleSubmit={handleSubmit}
      error={error}
      isLoading={isLoading}
    />
  );
}
