"use client"

import { useContext } from "react"
import Logo from "../Components/Logo"
import Login from "./Login"
import Register from "./Register"
import { ContextAPI } from "../context/ContextProvider"

const Accounts = () => {
  const { toggle, setToggle } = useContext(ContextAPI)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex items-center justify-center">
        <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Left Side - Promotional Content */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative z-10 text-center">
              <div className="mb-8">
                <div className="w-28 h-28 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
                  <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                    <Logo />
                  </div>
                </div>
                <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                <p className="text-lg opacity-90 leading-relaxed">
                  Connect with friends and discover amazing content. Join our community today and start sharing your
                  moments.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-sm opacity-80">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm opacity-80">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Easy to Use</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm opacity-80">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Connect Anywhere</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
            <div className="absolute top-1/2 left-5 w-8 h-8 bg-white bg-opacity-10 rounded-full"></div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              {/* Logo Section */}
              <div className="flex items-center justify-center mb-8">
                <div className="transform hover:scale-105 transition-transform duration-200">
                  <Logo />
                </div>
              </div>

              {/* Form Container */}
              <div className="bg-white">
                {!toggle ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to your account</h2>
                      <p className="text-gray-600">Welcome back! Please enter your details.</p>
                    </div>
                    <Login />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
                      <p className="text-gray-600">Join us today! It only takes a minute.</p>
                    </div>
                    <Register />
                  </div>
                )}
              </div>

              {/* Toggle Section */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                {!toggle ? (
                  <p className="text-center text-gray-600">
                    Don&lsquo;t have an account?{" "}
                    <button
                      className="text-blue-600 hover:text-blue-700 cursor-pointer font-semibold hover:underline transition-colors duration-200"
                      onClick={() => setToggle(true)}
                    >
                      Sign up for free
                    </button>
                  </p>
                ) : (
                  <p className="text-center text-gray-600">
                    Already have an account?{" "}
                    <button
                      className="text-blue-600 hover:text-blue-700 cursor-pointer font-semibold hover:underline transition-colors duration-200"
                      onClick={() => setToggle(false)}
                    >
                      Sign in here
                    </button>
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Accounts
