import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="relative">
                <h1 className="text-[12rem] font-bold text-gray-100 select-none">404</h1>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Oops! It seems the page you're looking for has wandered off into another dimension. Let's get you back on track.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-black text-white font-medium transition-all hover:bg-gray-800 hover:scale-105 active:scale-95 space-x-2"
                >
                    <Home size={18} />
                    <span>Back to Home</span>
                </Link>
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-medium transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 space-x-2"
                >
                    <ArrowLeft size={18} />
                    <span>Go Back</span>
                </button>
            </div>

            <div className="mt-12 opacity-50">
                <div className="inline-block p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400 italic">
                        "Not all those who wander are lost, but this page definitely is."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
