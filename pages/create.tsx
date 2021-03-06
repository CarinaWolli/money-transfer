import React, { useState } from "react"
import prisma from "../lib/prisma"
import { useSession, getSession, GetSessionParams } from "next-auth/react"
import axios from "axios"
import Router from "next/router"
import Balance from "../components/Balance"
import { calcBalance, calcTargetValue } from "../helpers/HelperFunctions"


export const getServerSideProps = async (context: GetSessionParams) => {
  const session = await getSession(context);
  if (!session) { 
    return { props: { allTransactions: [] } };
  }

  const allUserWithoutAdmin = await prisma.user.findMany({
    where: {
      NOT: {
        email: "money@transfer.com"
      }
    }
  })

  const allTransactions = await prisma.transaction.findMany({
    include: {
      toUser: true,
      fromUser: true,
    }
  })

  let url = new URL('https://api.exchangerate.host/latest')

  url.search = new URLSearchParams({
    base: 'USD',
    symbols: ['EUR', 'NGN']
  } as any).toString()

  const exchangeRatesUSDBase = await fetch(url.toString())
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response.json()
    }).catch(error => console.error(error));

  url.search = new URLSearchParams({
    base: 'EUR',
    symbols: ['USD', 'NGN']
  } as any).toString()

  const exchangeRatesEURBase = await fetch(url.toString())
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response.json()
    }).catch(error => console.error(error));

  url.search = new URLSearchParams({
    base: 'NGN',
    symbols: ['USD', 'EUR']
  } as any).toString()

  const exchangeRatesNGNBase = await fetch(url.toString())
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response.json()
    }).catch(error => console.error(error));

  const exchangeRates = { USD: exchangeRatesUSDBase, EUR: exchangeRatesEURBase, NGN: exchangeRatesNGNBase }

  return {
    props: {
      allUserWithoutAdmin,
      allTransactions,
      exchangeRates
    },
  }
}
interface Props {
  allUserWithoutAdmin: any, 
  allTransactions: any, 
  exchangeRates: any
}

export default function Create(props: Props) {
  const [toUserId, settoUserId] = useState(0)
  const [valueStringFormat, setValueStringFormat] = useState("0.00")
  const [sourceCurrency, setSourceCurrency] = useState("USD")
  const [targetCurrency, setTargetCurrency] = useState("USD")
  const [valueValid, setValueValid] = useState(false)
  const [userNotNone, setUserNotNone] = useState(false)
  const [enoughBalance, setEnoughBalance] = useState(true)

  const { data: session, status } = useSession()
  const fromUserId: any = (session != undefined) ? session.id : 0

  const balanceUsdEurNgn = calcBalance(props.allTransactions, fromUserId)

  const usdBalance = balanceUsdEurNgn.usdBalance
  const eurBalance = balanceUsdEurNgn.eurBalance
  const ngnBalance = balanceUsdEurNgn.ngnBalance

  let handleToChange = (e: any) => {
    if (e.target.value < 1) {
      setUserNotNone(false)
    } else {
      setUserNotNone(true)
    }
    settoUserId(parseInt(e.target.value))
  }

  let handleSourceCurrencyChange = (e: any) => {
    setSourceCurrency(e.target.value)
    if (valueValid) {
      isBalanceEnough(parseFloat(valueStringFormat), e.target.value)
    }
  }

  let handleTargetCurrencyChange = (e: any) => {
    setTargetCurrency(e.target.value)
  }

  function isBalanceEnough(value: number, currency: String) {
    switch (String(currency)) {
      case "USD":
        if (value > usdBalance) {
          setEnoughBalance(false)
        } else {
          setEnoughBalance(true)
        }
        break;
      case "EUR":
        if (value > eurBalance) {
          setEnoughBalance(false)
        } else {
          setEnoughBalance(true)
        }
        break;
      case "NGN":
        if (value > ngnBalance) {
          setEnoughBalance(false)
        } else {
          setEnoughBalance(true)
        }
        break;
    }
  }

  let handleValueChange = (e: any) => {
    const StringValue: String = e.target.value

    if (StringValue.match(/^[0-9.]+./) != null) {
      setValueValid(true)
    }
    else {
      setValueValid(false)
    }

    setValueStringFormat(e.target.value)

    if (valueValid) {
      isBalanceEnough(e.target.value, sourceCurrency)
    }
  }

  const submitData = async (e: React.SyntheticEvent) => {
    const sourceValue = parseFloat(valueStringFormat)
    let targetValue = 0.00

    if (sourceCurrency === targetCurrency) {
      targetValue = sourceValue
    } else {

      targetValue = calcTargetValue(sourceValue, sourceCurrency, targetCurrency, props.exchangeRates)
    }

    e.preventDefault()
    try {
      const body = { fromUserId, toUserId, sourceValue, targetValue, sourceCurrency, targetCurrency }
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
      <Balance allTransactions={props.allTransactions} userId={fromUserId} />
      <div className="bg-gray-bg1 mt-6">
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
                    <select onChange={handleToChange} className="w-64 px-2 py-3 text-normal text-gray-700">
                      <option key="default" value="0">None</option>
                      {props.allUserWithoutAdmin.filter((u: any) => u['id'] != fromUserId).map((user: any) => <option key={user['id']} value={user.id}>{user.email}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              {!userNotNone ? (
                <p className="text-red-500 text-xs italic -mx-3 mt-2">User cannot be none.</p>
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
            {!valueValid ? (
              <p className="text-red-500 text-xs italic -mx-3 mt-2">Invalid value. Value must be higher than 0. Expected format is 0.00</p>
            ) : (
              <div />
            )}
            {!enoughBalance ? (
              <p className="text-red-500 text-xs italic -mx-3 mt-2">Your Balance in that currency is not high enough.</p>
            ) : (
              <div />
            )}
            <div className="flex flex-wrap -mx-3 mt-5">
              <div className="flex items-center">
                <label
                  className="block tracking-wide text-gray-700 font-bold text-lg">
                  Convert to:
                </label>
                <div className="flex items-center border-2 rounded-md ml-5">
                  <select onChange={handleTargetCurrencyChange} className="px-4 py-3 text-normal text-gray-700" id="grid-state">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="NGN">NGN</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="-mx-3 pb-1 pt-3 mt-6">
              <button onClick={submitData} disabled={!valueValid || !userNotNone} className={"bg-indigo-500 text-white font-bold py-2 px-4 rounded " + (valueValid && userNotNone ? "" : "bg-gray-400 text-white")} >Send Money</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

