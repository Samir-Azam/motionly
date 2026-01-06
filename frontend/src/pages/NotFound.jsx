import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-9xl font-bold text-gray-300">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mt-4">
        Page Not Found
      </p>
      <p className="text-gray-500 mt-2 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-8 flex items-center space-x-2">
        <Home className="w-5 h-5" />
        <span>Go Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
