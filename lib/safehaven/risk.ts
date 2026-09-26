// Local vulnerability scoring, shelter filtering, and hazard-fetching logic
// has moved server-side — see lib/safehaven/api.ts for the live backend
// client. This file now only holds small shared display helpers.

export const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
