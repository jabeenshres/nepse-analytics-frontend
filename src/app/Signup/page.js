"use client"
import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/constraints";
import { register_endpoint } from "../config/endpoint";
import { useRouter} from "next/navigation";
export default function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}${register_endpoint}`, {
                username,
                email,
                password,
            });
            console.log("Signup successful: ", response.data);
            router.push("/Login")
            
        } catch (error) {
            console.log("error",error)
            setError(error.response?.data?.username || "Signup failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <section className="bg-gray-50 ">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="../" className="flex font-bold items-center mb-6 text-2xl font-semibold text-gray-900 ">
                        <img src="/images/sharelogom.png" className="h-30 w-20 me-3 sm:h-15" alt="ShareNepal Logo" />
                        <h4 className="font-bold text-3xl">SHARE NEPAL </h4>
                    </a>
                    <div className="w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Sign up for an account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSignUp}>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">User Name:</label>
                                    <input
                                        type="text"
                                        className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Email:</label>
                                    <input
                                        type="email"
                                        className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Password:</label>
                                    <input
                                        type="password"
                                        className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Confirm Password:</label>
                                    <input
                                        type="password"
                                        className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full text-white bg-gray-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    {isLoading ? "Signing up..." : "Sign Up"}
                                </button>
                                {error && <p className="mt-2 text-center text-sm text-red-600 font-bold">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
