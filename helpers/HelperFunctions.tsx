export function calcBalance(allTransactions, userId) {
  const incomingUSD = allTransactions.filter(t => t.toUserId === userId && t.targetCurrency === "USD").reduce(
    (total, transaction) => total + transaction.sourceValue, 0);

  const outgoingUSD = allTransactions.filter(t => t.fromUserId === userId && t.sourceCurrency === "USD").reduce(
    (total, transaction) => total + transaction.sourceValue, 0);

  const incomingEUR = allTransactions.filter(t => t.toUserId === userId && t.targetCurrency === "EUR").reduce(
    (total, transaction) => total + transaction.sourceValue, 0);

  const outgoingEUR = allTransactions.filter(t => t.fromUserId === userId && t.sourceCurrency === "EUR").reduce(
    (total, transaction) => total + transaction.sourceValue, 0);

  const incomingNGN = allTransactions.filter(t => t.toUserId === userId && t.targetCurrency === "NGN").reduce(
    (total, transaction) => total + transaction.sourceValue, 0);

  const outgoingNGN = allTransactions.filter(t => t.fromUserId === userId && t.sourceCurrency === "NGN").reduce(
    (total, transaction) => total + transaction.sourceValue, 0);

  const usdBalance = incomingUSD - outgoingUSD
  const eurBalance = incomingEUR - outgoingEUR
  const ngnBalance = incomingNGN - outgoingNGN

  return ({
    usdBalance, 
    eurBalance, 
    ngnBalance
    })
}