import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const user = page?.props?.auth?.user || null;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!user) return;
        const fetchNotifications = () => {
            fetch('/notifications')
                .then(res => res.json())
                .then(setNotifications);
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out sm:static sm:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between h-16 border-b px-4">
                    <Link href="/">
                        <ApplicationLogo className="h-9 w-auto fill-current text-gray-800" />
                    </Link>
                    <button
                        className="sm:hidden text-gray-500"
                        onClick={() => setSidebarOpen(false)}
                    >
                        ✖
                    </button>
                </div>
                <nav className="mt-4 flex flex-col space-y-2 px-4">
                <NavLink href={route('videos.explorer')} active={route().current('videos.explorer')}>
                        <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-binoculars" viewBox="0 0 16 16">
                        <path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h1A1.5 1.5 0 0 1 7 2.5V5h2V2.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5v2.382a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V14.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 14.5v-3a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5v3A1.5 1.5 0 0 1 5.5 16h-3A1.5 1.5 0 0 1 1 14.5V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882zM4.5 2a.5.5 0 0 0-.5.5V3h2v-.5a.5.5 0 0 0-.5-.5zM6 4H4v.882a1.5 1.5 0 0 1-.83 1.342l-.894.447A.5.5 0 0 0 2 7.118V13h4v-1.293l-.854-.853A.5.5 0 0 1 5 10.5v-1A1.5 1.5 0 0 1 6.5 8h3A1.5 1.5 0 0 1 11 9.5v1a.5.5 0 0 1-.146.354l-.854.853V13h4V7.118a.5.5 0 0 0-.276-.447l-.895-.447A1.5 1.5 0 0 1 12 4.882V4h-2v1.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5zm4-1h2v-.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm4 11h-4v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-8 0H2v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5z"/>
                        </svg>
                            <span>Explorer</span>
                        </div>
                    </NavLink>
                    <NavLink href={route('videos.feed')} active={route().current('videos.feed')}>
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"
                                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
                            </svg>
                            <span>My Feed</span>
                        </div>
                    </NavLink>
                    <NavLink href={route('videos.index')} active={route().current('videos.index')}>
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"
                                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15 10l4.553 2.276a1 1 0 010 1.448L15 16M4 6h16M4 12h8M4 18h16" />
                            </svg>
                            <span>My Videos</span>
                        </div>
                    </NavLink>
                    <NavLink href={route('playlists.my')} active={route().current('playlists.my')}>
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-music-note-list" viewBox="0 0 16 16">
                                <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2"/>
                                <path fillRule="evenodd" d="M12 3v10h-1V3z"/>
                                <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1z"/>
                                <path fillRule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5"/>
                            </svg>
                            <span>My Playlists</span>
                        </div>
                    </NavLink>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between bg-white border-b h-16 px-4 sm:px-6 lg:px-8">
                    <button
                        className="sm:hidden text-gray-600"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex-1 text-center sm:text-left">{header}</div>

                    <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                        {user ? (
                            <>
                                <div className="relative">
                                    <button onClick={() => setShowNotif(prev => !prev)} className="relative text-xl">
                                        🔔
                                        {notifications.some(n => !n.read) && (
                                            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
                                                {notifications.filter(n => !n.read).length}
                                            </span>
                                        )}
                                    </button>

                                    {showNotif && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow z-50">
                                            <div className="flex items-center justify-between px-3 py-2 border-b">
                                                <span className="font-bold text-sm">Notifications</span>
                                                <button
                                                    onClick={() => {
                                                        fetch('/notifications/mark-read', {
                                                            method: 'GET',
                                                            headers: {
                                                              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                                                              'Content-Type': 'application/json',
                                                            },
                                                          })
                                                          .then(() => {
                                                            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                                          });
                                                    }}
                                                    className="text-xs text-blue-600"
                                                >
                                                    Mark all as read
                                                </button>
                                            </div>
                                            <ul className="max-h-60 overflow-y-auto text-sm">
                                                {notifications.length === 0 ? (
                                                    <li className="p-3 text-gray-500 text-center">No notifications</li>
                                                ) : (
                                                    notifications.map(n => (
                                                        <li
                                                            key={n.id}
                                                            className={`px-3 py-2 border-b ${n.read ? 'text-gray-500' : 'text-black font-medium'}`}
                                                        >
                                                            <a href={n.url} className="hover:underline">{n.message}</a>
                                                        </li>
                                                    ))
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                                    className="text-sm font-medium text-gray-800 hover:underline"
                                >
                                    {user.name}
                                </button>
{profileDropdownOpen && (
    <div className="absolute right-0 top-full w-48 bg-white rounded-md shadow-lg py-1 z-50">
        <Link
            href={route('profile.show', user.id)} // Pass the logged-in user's ID
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
            Show Profile
        </Link>
        <Link
            href={route('profile.edit')}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
            Edit Profile
        </Link>
        <button
            type="button"
            onClick={() => router.post(route('logout'))}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
            Log Out
        </button>
    </div>
)}

                            </>
                        ) : (
                            <>
                                <Link href={route('register')} className="text-sm text-gray-700 hover:text-blue-600">
                                    Register
                                </Link>
                                <Link href={route('login')} className="text-sm text-gray-700 hover:text-blue-600">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
