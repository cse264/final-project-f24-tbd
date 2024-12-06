'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
      } else {
        const data = await response.json();
        console.log(data);
        localStorage.setItem('token', data.token);
        router.push('/lookup');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-black-100 bg-[url('/giphy.webp')] bg-cover bg-center">
      <main className="flex-grow flex flex-col items-center justify-center text-center">
      <div className="w-80 h-40 bg-orange-800 rounded-lg flex items-center justify-center">
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username" className="font-bold">Username</label>
          <input
            className="ml-2 mb-1"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="font-bold">Password</label>
          <input
            className="ml-2 mb-1"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <div className="flex">
        <button type="submit" className="ml-24 px-5 py-0.5 bg-orange-400 text-white font-semibold rounded-md hover:bg-orange-600 my-2 mb-1">Login</button>
        </div>
      </form>
      </div>
      </main>
      
    </div>
  );
}
