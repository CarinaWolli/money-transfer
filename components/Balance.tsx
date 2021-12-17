import React, { useState, useEffect } from "react"

export default function Balance(props) {
  const [usdBalance, setUsdBalance] = useState(0.00)
  const [eurBalance, setEurBalance] = useState(0.00)
  const [ngnBalance, setNgnBalance] = useState(0.00)

  useEffect(() => {

    const incomingUSD = props.allTransactions.filter(t => t.toUserId === props.userId && t.targetCurrency === "USD").reduce(
      (total, transaction) => total + transaction.value, 0);

    const outgoingUSD = props.allTransactions.filter(t => t.fromUserId === props.userId && t.sourceCurrency === "USD").reduce(
      (total, transaction) => total + transaction.value, 0);

    const incomingEUR = props.allTransactions.filter(t => t.toUserId === props.userId && t.targetCurrency === "EUR").reduce(
      (total, transaction) => total + transaction.value, 0);

    const outgoingEUR = props.allTransactions.filter(t => t.fromUserId === props.userId && t.sourceCurrency === "EUR").reduce(
      (total, transaction) => total + transaction.value, 0);

    const incomingNGN = props.allTransactions.filter(t => t.toUserId === props.userId && t.targetCurrency === "NGN").reduce(
      (total, transaction) => total + transaction.value, 0);

    const outgoingNGN = props.allTransactions.filter(t => t.fromUserId === props.userId && t.sourceCurrency === "NGN").reduce(
      (total, transaction) => total + transaction.value, 0);

    const usdBalanceCalaculated = incomingUSD -outgoingUSD
    const eurBalanceCalaculated = incomingEUR -outgoingEUR
    const ngnBalanceCalaculated = incomingNGN -outgoingNGN


    setUsdBalance(usdBalanceCalaculated)
    setEurBalance(eurBalanceCalaculated)
    setNgnBalance(ngnBalanceCalaculated)
  })

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded mt-5">
      <div className="rounded-t py-5 px-5 border-0">
        <h3 className="font-semibold text-base text-blueGray-700 text-2xl mb-3">Your Balance: </h3>
        <table className="table-fixed">
          <tbody>
            <tr>
              <td className="w-14" >USD:</td>
              <td>+ {usdBalance}</td>
            </tr>
            <tr>
              <td>EUR:</td>
              <td>+ {eurBalance}</td>
            </tr>
            <tr>
              <td>NGN:</td>
              <td>+ {ngnBalance}</td>
            </tr>
          </tbody>
        </table>
      </div >
    </div >
  )
}