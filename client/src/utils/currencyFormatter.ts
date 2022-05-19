export const currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
    currency: "MYR",
    style: "currency",
    currencySign: 'accounting',
    currencyDisplay: 'narrowSymbol',
})