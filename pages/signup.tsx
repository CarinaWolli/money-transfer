import React, { useState } from 'react'
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import { signIn } from 'next-auth/react'

const SignUp = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = { name, email, password };
            const res = await axios.post('/api/signup', body);
            res.data
            await Router.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mx-auto">
            <Head>
                <title>Sign Up</title>
            </Head>
            <div className='bg-gray-bg1 mt-15'>
                <div className='bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16'>
                    <div>
                        <img className="mx-auto h-12 w-auto" src="https://static.thenounproject.com/png/13792-84.png" alt="Workflow" />
                    </div>
                    <h3 className='text-2xl font-medium text-primary mt-6 mb-3 text-center'>
                        Sign up
                    </h3>
                    <div className='flex justify-center items-center mb-8'>
                        <a> Already an account? </a>
                        <a href="/login" className="font-medium text-indigo-500 hover:text-indigo-500">
                            Sign in
                        </a>
                    </div>
                    <form>
                        <div>
                            <label htmlFor='text'>Full Name</label>
                            <input
                                autoFocus
                                onChange={(e) => setName(e.target.value)}
                                type='text'
                                className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                                id='name'
                                placeholder='Your Full Name'
                                value={name}
                            />
                        </div>
                        <div>
                            <label htmlFor='email'>Email</label>
                            {
                                email === '' &&
                                <small className="text-xs text-red-600"><br />Email Cannot be empty</small>
                            }
                            <input
                                type='email'
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                                id='email'
                                placeholder='Your Email'
                                value={email}
                            />
                        </div>
                        <div>
                            <label htmlFor='password'>Password</label>
                            {
                                password === '' &&
                                <small className="animate-pulse text-xs text-red-600"><br />Password Cannot be empty</small>
                            }
                            <input
                                type='password'
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                                id='password'
                                placeholder='Your Password'
                                value={password}
                            />
                        </div>

                        <div className='flex justify-center items-center mt-6'>
                            <button
                                disabled={!name || !email || !password} type="submit"
                                onClick={submitData}
                                className="bg-indigo-500 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default SignUp