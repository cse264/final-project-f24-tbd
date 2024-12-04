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
    // <div className="min-h-screen flex flex-col justify-between bg-black-100">
    //   <main className="flex-grow flex flex-col items-center justify-center text-center">
    //   <Image src="/Ybin.gif"
    //    alt="bookgif" 
    //    width={300} height={200} 
    //    className="mb-4" />
    //     <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-bold mb-2">The HyperSpace Library</h1>
    //     <hr className="w-full max-w-md border-t-2 border-gray-300 my-4" />
    //     <Link href="/login" className="px-6 py-3 bg-orange-800 my-4 text-white font-semibold rounded-md hover:bg-orange-600">
    //         Get Started
    //     </Link>
    //   </main>
    //   <footer className="p-4 text-center">
        
    //   </footer>
    // </div>


    <div className="min-h-screen flex flex-col justify-between bg-black-100 bg-[url('/giphy.webp')] bg-cover bg-center">
      <main className="flex-grow flex flex-col items-center justify-center text-center">
      
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
      </main>
    </div>
  );
}
