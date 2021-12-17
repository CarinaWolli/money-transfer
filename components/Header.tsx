import React from "react"
import { RiAccountCircleLine } from "react-icons/ri"
import { GrLogout } from "react-icons/gr"
import { Menu, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return (
      <nav className="bg-gray-300 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <a href="/" className="flex">
            <img className="h-10 mr-3" src="https://static.thenounproject.com/png/13792-84.png" />
            <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">Money Transfer</span>
          </a>
          <div className="hidden md:block w-full md:w-auto">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <ul className="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium">
                    <li>
                      <RiAccountCircleLine className="text-2xl" title="test" />
                    </li>
                    <li>
                      <div>{session.user.email}</div>
                    </li>
                  </ul>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button className="text-black group flex rounded-md items-center w-full px-2 py-2 text-sm">
                          <GrLogout
                            className="w-5 h-5 mr-2"
                          />
                          <button onClick={() => {
                            signOut({
                              callbackUrl: "/login"
                            })
                          }}>Logout</button>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </nav>
    )
  } else {
    return null
  }
}