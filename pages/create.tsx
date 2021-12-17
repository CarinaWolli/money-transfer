import React, { useState } from "react"
import prisma from "../lib/prisma"
import { useSession } from "next-auth/react"
import axios from "axios"
import Router from "next/router"
import { RiMoneyPoundCircleLine } from "react-icons/ri"

export const getServerSideProps = async () => {
  const allUserWithoutAdmin = await prisma.user.findMany({
    where: {
      NOT: {
        email: "money@transfer.com"
      }
    }
  })
  return {
    props: { allUserWithoutAdmin },
  }
}

export default function Create(props) {
  const [toUserId, settoUserId] = useState(0)
  const [valueStringFormat, setValueStringFormat] = useState("0.00")
  const [sourceCurrency, setSourceCurrency] = useState("USD")
  const [targetCurrency, setTargetCurrency] = useState("USD")
  const [valid, setValid] = useState(false)
  const [userNotNone, setUserNotNone] = useState(false)

  const { data: session, status } = useSession()
  const fromUserId = (session != undefined) ? session.id : 0

  let handleToChange = (e) => {
    if (e.target.value < 1) {
      setUserNotNone(false)
    } else {
      setUserNotNone(true)
    }
    settoUserId(parseInt(e.target.value))
  }

  let handleSourceCurrencyChange = (e) => {
    setSourceCurrency(e.target.value)
  }

  let handleTargetCurrencyChange = (e) => {
    setTargetCurrency(e.target.value)
  }

  let handleValueChange = (e) => {
    const StringVal: String = e.target.value
    if (StringVal.includes(".")) {
      let splitString = StringVal.split(".")
      if (splitString.length - 1 == 1 && splitString[1].length == 2 && StringVal != "0.00") {

        setValueStringFormat(e.target.value)
        setValid(true)
      } else {
        setValueStringFormat(e.target.value)
        setValid(false)
      }
    } else {
      setValueStringFormat(e.target.value)
      setValid(false)
    }
  }

  const submitData = async (e: React.SyntheticEvent) => {
    const value = parseFloat(valueStringFormat)
    e.preventDefault()
    try {
      const body = { fromUserId, toUserId, value, sourceCurrency, targetCurrency }
      const res = await axios.post("/api/create", body)
      res.data
      await Router.push("/")
    } catch (error) {
      console.error(error)
    }
  }

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
            <div className="mb-6">
              <div className="flex flex-wrap -mx-3">
                <div className="flex items-center">
                  <label className="block tracking-wide text-gray-700 font-bold text-lg">
                    To:
                  </label>
                  <div className="flex w-72 items-center border-2 rounded-md ml-11">
                    <select onChange={handleToChange} type="number" className="w-64 px-2 py-3 text-normal text-gray-700">
                      <option key="default" value="0">None</option>
                      {props.allUserWithoutAdmin.filter(u => u.id != fromUserId).map((user) => <option key={user.id} value={user.id}>{user.email}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              {!userNotNone ? (
                <p className="text-red-500 text-xs italic -mx-3 mt-2">User can't be none.</p>
              ) : (
                <div />
              )}
            </div>
            <div className="flex flex-wrap -mx-3">
              <div className="flex items-center">
                <label
                  className="block tracking-wide text-gray-700 font-bold text-lg">
                  Value:
                </label>
                <input
                  className="appearance-none block w-44 text-gray-700 border-2 border-gray-200 rounded py-3 px-4 ml-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  placeholder="0.00"
                  value={valueStringFormat}
                  onChange={handleValueChange} />
                <div className="flex items-center border-2 rounded-md ml-5">
                  <select onChange={handleSourceCurrencyChange} className="px-4 py-3 text-normal text-gray-700" id="grid-state">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="NGN">NGN</option>
                  </select>
                </div>
              </div>
            </div>
            {!valid ? (
              <p className="text-red-500 text-xs italic -mx-3 mt-2">Invalid value. Value must be higher than 0. Expected format is 0.00</p>
            ) : (
              <div />
            )}
            <div className="flex flex-wrap -mx-3">
              <select onChange={handleTargetCurrencyChange} className="px-4 py-3 text-normal text-gray-700" id="grid-state">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="NGN">NGN</option>
              </select>
            </div>
            <div className="-mx-3 pb-1 pt-3 mt-6">
              <button onClick={submitData} disabled={!valid || !userNotNone} className={"bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded " + (valid && userNotNone ? "" : "bg-gray-400 text-white")} >Send Money</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

