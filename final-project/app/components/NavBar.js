import Link from 'next/link'

export const NavBar = () => {
  return (
    <div className="w-full bg-black-100">
      <nav className="flex justify-center space-x-4 py-2 bg-orange-800 text-white">
        <Link href='/' className="hover:underline">Home</Link>
        <Link href='/login' className="hover:underline">Login</Link>
      </nav>
    </div>
  )
}
