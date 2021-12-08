import { useSession } from "next-auth/react"
import Layout from '../components/Layout';
import prisma from '../lib/prisma';
import Link from 'next/link';
import { useRouter } from 'next/router'

export const getServerSideProps = async () => {
  const allTransactions = await prisma.transaction.findMany();
  return {
    props: { allTransactions }, // will be passed to the page component as props
  }
}

export default function Index (props) {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }
  if (!session) {
    window.location.assign(window.location.href+'/api/auth/signin')
    return null    
  }
    if (props.allTransactions) {
      return (
        <Layout>
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
              <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1 pl-0">
                    <h3 className="font-semibold text-base text-blueGray-700 text-2xl">Transactions</h3>
                  </div>
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">         
                    <Link href="/create">
                      <button className="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"><a>New Transaction</a></button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="block w-full overflow-x-auto">
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
                  <tbody>
                    {props.allTransactions.map((transaction) =>
                      <tr key={transaction.id}>
                        <td key={transaction.id} className="pl-2">{transaction.id}</td>
                        {session.user.sub.substring(6) === transaction.fromId ? <td key={transaction.id} className="pl-2">You</td> : <td key={transaction.id} className="pl-2">{transaction.fromEmail}</td> }
                        {session.user.sub.substring(6) === transaction.toId ? <td key={transaction.id} className="pl-2">You</td> : <td key={transaction.id} className="pl-2">{transaction.toEmail}</td> }
                        <td key={transaction.id} className="pl-2">{transaction.value}</td>
                        <td key={transaction.id} className="pl-2">{transaction.curreny}</td>
                        <td key={transaction.id} className="pl-2">{transaction.createdAt.toString().substring(4,25)}</td>
                        <td key={transaction.id} className="pl-2">{transaction.updatedAt.toString().substring(4,25)}</td>
                      </tr>
                    )}
                  </tbody>


                </table>
              </div>
            </div>
          </div>

        </Layout>
      );
  } else {
    return (
      <Layout>
        <div>
          no Transactions
        </div>
      </Layout>
    )
    }
}

