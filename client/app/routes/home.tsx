import { useState } from 'react';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Passkey project' },
    { name: 'description', content: 'Welcome to Passkey project' },
  ];
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    isLoggedIn ? (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='bg-white rounded-lg shadow-xl p-10 text-center'>
        <h1 className='text-4xl font-extrabold text-gray-800 mb-4 flex items-center justify-center'>
          <span className='mr-2'>🎉</span>
          Login Successful!
          <span className='ml-2'>🔐</span>
        </h1>
        <p className='text-lg text-gray-600'>
          Welcome to the Passkey project! Enjoy your secure access.
        </p>
        <div className='mt-6'>
          <button 
            className='bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-400 transition duration-300 ease-in-out cursor-pointer'
            onClick={() => setIsLoggedIn(false)}
          >
            <span className='mr-2'>🔓</span> Logout
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='bg-white rounded-lg shadow-xl p-10 text-center'>
        <h1 className='text-4xl font-extrabold text-gray-800 mb-4 flex items-center justify-center'>
          Welcome to the Passkey project!
          <span className='ml-2'>🔐</span>
        </h1>
        <div className='mt-6 space-x-4'>
          <button 
            className='bg-teal-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-teal-400 transition duration-300 ease-in-out cursor-pointer'
            onClick={() => setIsLoggedIn(true)}
          >
            <span className='mr-2'>🔑</span> Log in
          </button>
          <button 
            className='bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-400 transition duration-300 ease-in-out cursor-pointer'
          >
            <span className='mr-2'>📝</span> Sign up
          </button>
        </div>
      </div>
    </div>
  ))
}
