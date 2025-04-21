import { use, useEffect, useState } from 'react';
import type { Route } from './+types/home';
import { logout } from '../../lib/api';
import { AuthContext } from '../../lib/authProvider';
import { useNavigate } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Passkey project' },
    { name: 'description', content: 'Welcome to Passkey project' },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { loggedIn, username } = use(AuthContext);

  const handleLogout = () => {
    logout()
      .then((response) => {
        if (response.message) {
          navigate('/login');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    } else {
      navigate('/');
    }
  }, [loggedIn]);

  if (loggedIn) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='bg-white rounded-lg shadow-xl p-10 text-center'>
          <h1 className='text-4xl font-extrabold text-gray-800 mb-4 flex items-center justify-center'>
            <span className='mr-2'>🎉</span>
            Login done {username} !<span className='ml-2'>🔐</span>
          </h1>
          <p className='text-lg text-gray-600'>
            Welcome to the Passkey project! Enjoy your secure access.
          </p>
          <div className='mt-6'>
            <button
              className='bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-400 transition duration-300 ease-in-out cursor-pointer'
              onClick={handleLogout}
            >
              <span className='mr-2'>🔓</span> Logout
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='bg-white rounded-lg shadow-xl p-10 text-center'>
          <h1 className='text-4xl font-extrabold text-gray-800 mb-4 flex items-center justify-center'>
            You need to login<span className='ml-2'>🔐</span>
          </h1>
          <p className='text-lg text-gray-600'>
            Welcome to the Passkey project! Enjoy your secure access.
          </p>
          <div className='mt-6'>
            <button
              className='bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-400 transition duration-300 ease-in-out cursor-pointer'
              onClick={() => navigate('/login')}
            >
              <span className='mr-2'>🔓</span> Login
            </button>
          </div>
        </div>
      </div>
    );
  }
}
