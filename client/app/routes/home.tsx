import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Passkey project' },
    { name: 'description', content: 'Welcome to Passkey project' },
  ];
}

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='bg-white rounded-lg shadow-xl p-10 text-center'>
        <h1 className='text-4xl font-extrabold text-gray-800 mb-4 flex items-center justify-center'>
          <span className='mr-2'>😁</span>
          Login Successful!
          <span className='ml-2'>🔑</span>
        </h1>
        <p className='text-lg text-gray-600'>
          Welcome to the Passkey project! Enjoy your secure access.
        </p>
        <div className='mt-6'>
          <button className='bg-red-500 text-white px-4 py-2 rounded-full shadow hover:bg-red-400 cursor-pointer'>
            <span className='mr-2'>🚪</span> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
