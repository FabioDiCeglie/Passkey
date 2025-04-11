import type { Route } from './+types/home';
import FormComponent from '../components/FormComponent';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Passkey project - Sign up' },
    { name: 'description', content: 'Sign up for Passkey project' },
  ];
}

export default function SignUp() {
  return (
    <FormComponent
      title="Sign up"
      buttonText="Sign up"
      linkText="Log in"
      linkHref="/login"
      linkPrompt="Already have an account?"
    />
  );
}
