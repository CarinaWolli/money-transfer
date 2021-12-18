import { useSession } from "next-auth/react"
import prisma from "../lib/prisma"
import Link from "next/link"
import { useRouter } from "next/router"
import Balance from "../components/Balance"

export const getServerSideProps = async () => {
  const allTransactions = await prisma.transaction.findMany({
    include: {
      toUser: true,
      fromUser: true,
    }
  })
  return {
    props: { allTransactions },
  }
}

export default function Index(props) {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }
  if (!session) {
    window.location.assign(window.location.href + "/api/auth/signin")
    return null
  }

  const usersTransactions = props.allTransactions.filter(t => t.fromUserId === session.id || t.toUserId === session.id)

  if (props.allTransactions && usersTransactions.length > 0) {
    return (
      <div className="mx-auto">
        <Balance allTransactions={props.allTransactions} userId={session.id} />
        <div className=" mt-16">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
            <div className="rounded-t mb-0 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full max-w-full flex-grow flex-1 px-8">
                  <h3 className="font-semibold text-base text-blueGray-700 text-2xl">Transactions</h3>
                </div>
                <div className="relative w-full max-w-full flex-grow flex-1 text-right px-8">
                  <Link href="/create" passHref>
                    <button className="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"><a>New Transaction</a></button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="block w-full overflow-x-auto px-4 py-4">
              <table className="items-start bg-transparent w-full border-collapse ">
                <thead>
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-2">
                      ID
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-0">
                      From
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-3">
                      To
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-3">
                      Value
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-5">
                      Currency
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-3">
                      Created At
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-6">
                      Updated At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usersTransactions.map((transaction) =>
                    <tr key={transaction.id}>
                      <td key={transaction.id} className="pl-2">{transaction.id}</td>
                      {session.id === transaction.fromUserId ?
                        (<>
                          <td key={transaction.id} className="pl-0">You</td>
                          <td key={transaction.id} className="pl-3">{transaction.toUser.name}</td>
                          <td key={transaction.id} className="pl-3 text-red-600">- {transaction.sourceValue.toFixed(2)}</td>
                          <td key={transaction.id} className="pl-5">{transaction.sourceCurrency}</td>
                        </>)
                        :
                        (<>
                          <td key={transaction.id} className="pl-0">{transaction.fromUser.name}</td>
                          <td key={transaction.id} className="pl-3">You</td>
                          <td key={transaction.id} className="pl-3 text-green-600">+ {transaction.sourceValue.toFixed(2)}</td>
                          <td key={transaction.id} className="pl-5">{transaction.targetCurrency}</td>
                        </>)
                      }

                      <td key={transaction.id} className="pl-2">{transaction.createdAt.toString().substring(4, 21)}</td>
                      <td key={transaction.id} className="pl-6">{transaction.updatedAt.toString().substring(4, 21)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="mx-auto">
        <div className=" mt-24">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
            <div className="rounded-t mb-0 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full max-w-full flex-grow flex-1 px-8">
                  <h3 className="font-semibold text-base text-blueGray-700 text-2xl">Transactions</h3>
                </div>
                <div className="relative w-full max-w-full flex-grow flex-1 text-right px-8">
                  <Link href="/create" passHref>
                    <button className="bg-indigo-500 text-white active:bg-indigo-600 texçt-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"><a>New Transaction</a></button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="block w-full overflow-x-auto px-4 py-4">
              <table className="items-start bg-transparent w-full border-collapse ">
                <thead>
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-2">
                      ID
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-2">
                      From
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-2">
                      To
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-2">
                      Value
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-2">
                      Currency
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-2">
                      Created At
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left pl-2">
                      Updated At
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

