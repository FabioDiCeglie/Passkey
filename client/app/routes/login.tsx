import type { Route } from './+types/home';
import FormComponent from '../components/FormComponent';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Passkey project - Log in' },
    { name: 'description', content: 'Log in to Passkey project' },
  ];
}

export default function Login() {
  return (
    <FormComponent
      title="Log in"
      buttonText="Log in"
      linkText="Register"
      linkHref="/signup"
      linkPrompt="Don't have an account yet?"
    />
  );
}
