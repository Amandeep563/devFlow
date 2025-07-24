import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin((prev) => !prev);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-400">
            {isLogin
              ? "Sign in to your account to continue"
              : "Join us and start your journey today"}
          </p>
        </div>

        {isLogin ? <Login /> : <Register />}

        <div className="text-center mt-6">
          <p className="text-gray-400 mb-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={toggleMode}
            className="text-white hover:text-gray-300 font-medium transition-colors duration-200 underline underline-offset-4"
          >
            {isLogin ? "Create new account" : "Sign in instead"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
