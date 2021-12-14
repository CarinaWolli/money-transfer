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
  const { data: session } = useSession()
  
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
    if(StringVal.includes('.')){
      let splitString = StringVal.split('.')
        if (splitString.length-1 == 1 && splitString[1].length ==2 && StringVal != '0.00'){

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

  return (
    <div className="mx-auto"> 
      <div className="className='bg-gray-bg1 mt-15'">
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
                <label className="block tracking-wide text-gray-700 text-xs font-bold text-lg">
                  To:
                </label>
                <div className="flex items-center col-span-3 border-2 rounded-md ml-4">
                  <select onChange={handleToChange} type="number" className="px-4 py-2 text-normal">
                    <option key="default" value="default">None</option>
                    {props.allUser.map((user) => <option key={user.id} value={user.id}>{user.email}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="flex items-center">
                <label 
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Value
                </label>
                <input 
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                type="text"
                placeholder="0.00"
                value={value}
                onChange={handleValueChange}/>
              </div>
              {!valid ? (
                <p className="text-red-500 text-xs italic">Invalid format. Value must be higher than 0 and expected format is 0.00</p>
              ) : (
                <div/>
              )}
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <div className="relative">
                  <select onChange={handleCurrencyChange} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="NGN">NGN</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <button onClick={submitData}>Send Money</button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

