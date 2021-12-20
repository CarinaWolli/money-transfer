export function calcBalance(allTransactions, userId) {
  const incomingUSD = allTransactions.filter(t => t.toUserId === userId && t.targetCurrency === "USD").reduce(
    (total, transaction) => total + transaction.targetValue, 0);

  const outgoingUSD = allTransactions.filter(t => t.fromUserId === userId && t.sourceCurrency === "USD").reduce(
    (total, transaction) => total + transaction.sourceValue, 0);

  const incomingEUR = allTransactions.filter(t => t.toUserId === userId && t.targetCurrency === "EUR").reduce(
    (total, transaction) => total + transaction.targetValue, 0);

  const outgoingEUR = allTransactions.filter(t => t.fromUserId === userId && t.sourceCurrency === "EUR").reduce(
    (total, transaction) => total + transaction.sourceValue, 0);

  const incomingNGN = allTransactions.filter(t => t.toUserId === userId && t.targetCurrency === "NGN").reduce(
    (total, transaction) => total + transaction.targetValue, 0);

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

export function calcTargetValue(sourceValue, sourceCurrency, targetCurrency, exchangeRates) {
  let targetValue = 0.00

  switch (String(sourceCurrency)) {
    case "USD":
      switch (String(targetCurrency)) {
        case "EUR":
          targetValue = sourceValue * exchangeRates.USD.rates.EUR
          break;
        case "NGN":
          targetValue = sourceValue * exchangeRates.USD.rates.NGN
          break;
      }
      break;
    case "EUR":
      switch (String(targetCurrency)) {
        case "USD":
          targetValue = sourceValue * exchangeRates.EUR.rates.USD
          break;
        case "NGN":
          targetValue = sourceValue * exchangeRates.EUR.rates.NGN
          break;
      }
      break;
    case "NGN":
      switch (String(targetCurrency)) {
        case "USD":
          targetValue = sourceValue * exchangeRates.NGN.rates.USD
          break;
        case "EUR":
          targetValue = sourceValue * exchangeRates.NGN.rates.EUR
          break;
      }
      break;
  }
  return targetValue
}