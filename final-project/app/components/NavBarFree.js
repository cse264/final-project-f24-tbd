import React from 'react';

export const NavBarFree = ({ logout }) => {
    return(
        <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/lookup">Lookup</a></li>
            <li><a href="/likedBooks">Liked Books</a></li>
            <li><button onClick={logout}>Log Out</button></li>
        </ul>
    </nav>
    )
}