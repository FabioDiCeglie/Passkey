import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Passkey project' },
    { name: 'description', content: 'Welcome to Passkey project' },
  ];
}

export default function SignUp() {
  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-white'>
          Sign up
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form className='space-y-6'>
          <div>
            <label
              htmlFor='username'
              className='block text-sm/6 font-medium text-gray-300'
            >
              Username
            </label>
            <div className='mt-2'>
              <input
                id='username'
                name='username'
                type='username'
                required
                autoComplete='username'
                className='block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-gray-300 outline-1 -outline-offset-1 outline-gray-600 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm/6'
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500'
            >
              Create passkey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
