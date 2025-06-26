import React from 'react';
import Link from 'next/link';

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow-sm z-10"> {}
            <div className="flex-1">
                {}
                <Link href="/" className="btn btn-ghost text-xl">daisyUI</Link>
            </div>
            <div className="flex gap-2">
                <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow" // Gunakan z-[1]
                    >
                        <li>
                            {/* Gunakan Link dari next/link */}
                            <Link href="/profile" className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </Link>
                        </li>
                        <li>
                            {/* Gunakan Link dari next/link, atau a jika ini link eksternal atau action yang tidak ke halaman lain */}
                            <Link href="/settings">Settings</Link>
                        </li>
                        <li>
                            {/* Ini mungkin action Logout, jadi <a> tag mungkin OK jika tidak navigasi ke halaman lain */}
                            <a>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}