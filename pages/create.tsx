import React, { useState } from 'react'
import prisma from '../lib/prisma';
import { useSession } from "next-auth/react"
import axios from 'axios';
import Router from 'next/router';




export const getServerSideProps = async () => {
  const allUser = await prisma.user.findMany()
  return {
    props: { allUser }, // will be passed to the page component as props
  }
}

export default function Create(props) {
  const { data: session, status } = useSession()

  const [toUserId, settoUserId] = useState(0)
  const [value, setValue] = useState('0.00')
  const [currency, setCurrency] = useState('')
  const [valid, setValid] = useState(false)
  const fromUserId = (session != undefined) ? session.id : 0

  let handleToChange = (e) => {
    settoUserId(parseInt(e.target.value))
  }

  let handleCurrencyChange = (e) => {
    setCurrency(e.target.value)
  }

  let handleValueChange = (e) => {
    const StringVal: String = e.target.value
    if (StringVal.includes('.')) {
      let splitString = StringVal.split('.')
      if (splitString.length - 1 == 1 && splitString[1].length == 2 && StringVal != '0.00') {

        setValue(e.target.value)
        setValid(true)
      } else {
        setValue(e.target.value)
        setValid(false)
      }
    } else {
      setValue(e.target.value)
      setValid(false)
    }
  }

  const submitData = async (e: React.SyntheticEvent) => {
    const val = parseFloat(value)
    e.preventDefault();
    try {
      const body = { fromUserId, toUserId, val, currency };
      const res = await axios.post('/api/create', body);
      res.data
      await Router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>
  }

  return (
    <div className="mx-auto">
      <div className="bg-gray-bg1 mt-24">
        <div className="bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
          <div className="mb-10 px-4 py-3 ">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 pl-0">
                <h3 className="text-center font-semibold text-base text-blueGray-700 text-2xl">New Transaction</h3>
              </div>
            </div>
          </div>
          <form className="w-full max-w-lg">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="flex items-center">
                <label className="block tracking-wide text-gray-700 font-bold text-lg">
                  To:
                </label>
                <div className="flex items-center col-span-3 border-2 rounded-md ml-11">
                  <select onChange={handleToChange} type="number" className="px-4 py-3 text-normal text-gray-700">
                    <option key="default" value="default">None</option>
                    {props.allUser.map((user) => <option key={user.id} value={user.id}>{user.email}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="flex items-center">
                <label
                  className="block tracking-wide text-gray-700 font-bold text-lg">
                  Value:
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 ml-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  placeholder="0.00"
                  value={value}
                  onChange={handleValueChange} />
                <div className="flex items-center col-span-3 border-2 rounded-md ml-4 mb-3">
                  <select onChange={handleCurrencyChange} className="px-4 py-3 text-normal text-gray-700" id="grid-state">
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="NGN">NGN</option>
                  </select>
                </div>
              </div>
              {!valid ? (
                <p className="text-red-500 text-xs italic">Invalid value. Value must be higher than 0 and expected format is 0.00</p>
              ) : (
                <div />
              )}
            </div>
            <div className="-mx-3 pb-1 pt-3">
                <button onClick={submitData} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">Send Money</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

