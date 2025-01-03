import Link from 'next/link'

export const NavBarPrem = ({ logout }) => {
    return(
        <div className="w-full bg-black-100">
        <nav className="flex justify-center space-x-4 py-2 bg-orange-800 text-white">
            <Link href='/' className="hover:underline">Home</Link>
            <Link href='/lookup' className="hover:underline">Lookup</Link>
            <Link href='/likedBooks' className="hover:underline">Liked Books</Link>
            <Link href='/recommended' className="hover:underline">Recommended</Link>
            <button onClick={logout} className="hover:underline bg-transparent text-white border-none cursor-pointer"> Log Out </button>
        </nav>
        </div>
    )
}