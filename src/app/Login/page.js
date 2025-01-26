"use client"
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { BASE_URL } from "../config/constraints";
// import { Auth_URL, BASE_URL } from '../config/constraints';
import axios from "axios";
import { setCookies } from "@/app/utils/setCookies";
import { login } from '../config/endpoint';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setError(null);
        setIsLoading(true);
    
        try {
            console.log("Posting_data...");
            const response = await axios.post(`${BASE_URL}${login}`, {
              username,
              password,
            });
    
            const token = response.data;
            setCookies("token", JSON.stringify(token));

            console.log("Token:", token);
            // Perform further actions, e.g., save the token, redirect, etc.
            router.push('/') // Redirect to the home page
        } catch (err) {
            console.error("Login error:", err);
            setError(err?.response?.data?.error || "No active account found with the given credentials");
        }   finally {
            setIsLoading(false);
        }
    };

    return (
        <div>   
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="flex items-center justify-center text-4xl font-bold text-gray-900">
                        <h1>SHARE NEPAL</h1>
                    </div>
                    <h2 className="mt-10 text-center text-2xl/9 font-thin font-serif tracking-tight text-gray-900">
                        Login to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>



                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                            >
                                {isLoading ? "Signing in..." : "Sign-in"}
                            </button>
                        </div>

                        {error && (
                            <p className="mt-2 text-center text-sm text-red-600 font-bold">{error}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
