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
    <div>
            <Head>
                <title>Sign Up</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className='h-screen flex bg-gray-bg1'>
                <div className='w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16'>
                    <h1 className='text-lg text-center text-primary'>Simba Finance App</h1>
                    <h1 className='text-2xl font-medium text-primary mt-4 mb-12 text-center'>
                        Sign up
                    </h1>

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
                            <Link href='/'>
                                <button
                                    className="bg-primary mr-6 py-2 px-4 text-sm text-black rounded border border-green focus:outline-none focus:border-green-dark"
                                >
                                    Login
                                </button>
                            </Link>
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