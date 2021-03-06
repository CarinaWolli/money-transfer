import Head from "next/head"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"


export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (router.query.error) {
      setLoginError("Invalid username or password")
    }
  }, [router])

  const handleLogin = async (e: any) => {
    e.preventDefault()
    await signIn("credentials",
      {
        email,
        password,
        callbackUrl: "/",
      }
    )
  }

  return (
    <div className="mx-auto">
      <Head>
        <title>Sign In</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="bg-gray-bg1 mt-20">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-20">
            <div>
              <img className="mx-auto h-12 w-auto" src="https://static.thenounproject.com/png/13792-84.png" alt="Workflow" />
            </div>
            <h3 className="text-2xl font-medium text-primary mt-6 mb-8 text-center">
              Sign in
            </h3>
            <form className="mt-8 space-y-3" onSubmit={(e) => handleLogin(e)}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label className="sr-only">Email address</label>
                  <input id="loginEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                </div>
                <div>
                  <label className="sr-only">Password</label>
                  <input id="inputPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
                </div>
              </div>
              {loginError ?
                <div className="bg-red-100 border border-red-400 text-red-700 text-xs px-5 py-1 rounded" role="alert">
                  <span className="block sm:inline">{loginError}</span>
                </div>
                :
                <div></div>
              }
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a> No account yet? </a>
                  <Link href="/signup">
                    <a className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a>
                  </Link>
                </div>
              </div>
              <div>
                <button type="submit" className="mt-7 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
