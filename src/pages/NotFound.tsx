const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-red-400 text-white text-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-36 h-36 mb-6 text-white"
            >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-lg mb-6">
                Oops! The page you are looking for doesn't exist.
            </p>
            <a
                href="/"
                className="px-6 py-3 text-lg font-semibold text-pink-500 bg-white rounded-md shadow-md hover:bg-pink-500 hover:text-white transition duration-300"
            >
                Go Back Home
            </a>
        </div>
    );
};

export default NotFound;