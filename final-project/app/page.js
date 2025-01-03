import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-black-100 bg-[url('/giphy.webp')] bg-cover bg-center">
      <main className="flex-grow flex flex-col items-center justify-center text-center">
      <Image src="/Ybin.gif"
       alt="bookgif" 
       width={300} height={200} 
       className="mb-4" />
        <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-bold mb-2">The HyperSpace Library</h1>
        <hr className="w-full max-w-3xl border-t-2 border-gray-300 my-4" />
        <Link href="/login" className="px-6 py-3 bg-orange-600 my-4 text-white font-semibold rounded-md hover:bg-orange-400">
            Get Started
        </Link>
      </main>
      <footer className="p-4 text-center">
        
      </footer>
    </div>
  );
}
