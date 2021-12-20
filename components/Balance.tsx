import React, { useState, useEffect } from "react"
import { calcBalance } from "../helpers/HelperFunctions"

export default function Balance(props) {
  const [usdBalance, setUsdBalance] = useState(0.00)
  const [eurBalance, setEurBalance] = useState(0.00)
  const [ngnBalance, setNgnBalance] = useState(0.00)

  useEffect(() => {
    const balanceUsdEurNgn = calcBalance(props.allTransactions, props.userId)

    setUsdBalance(balanceUsdEurNgn.usdBalance)
    setEurBalance(balanceUsdEurNgn.eurBalance)
    setNgnBalance(balanceUsdEurNgn.ngnBalance)
  })

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded mt-5">
      <div className="rounded-t py-5 px-5 border-0">
        <h3 className="font-semibold text-base text-blueGray-700 text-2xl mb-3">Your Balance: </h3>
        <table className="table-fixed">
          <tbody>
            <tr>
              <td className="w-14" >USD:</td>
              <td>+ {usdBalance.toFixed(2)}</td>
            </tr>
            <tr>
              <td>EUR:</td>
              <td>+ {eurBalance.toFixed(2)}</td>
            </tr>
            <tr>
              <td>NGN:</td>
              <td>+ {ngnBalance.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div >
    </div >
  )
}