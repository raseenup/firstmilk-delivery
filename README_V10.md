# Driver portal v10

Deploy the matching dairy-backend v10 change before this portal.

After signup email verification, a visible application-submitted banner explains
that the driver will receive an email after administrator approval. Approval
also appears in Profile notifications after the driver signs in.

Cash flow shows today's COD separately from cumulative outstanding cash:

`confirmed COD − approved expenses − accounts receipts`

Balances carry across dates and shifts. Expenses await accounts review. Submit
cash handed over with a reference; the balance clears only when Finance or
Super Admin confirms receipt. Partial receipts and the receipt history remain
visible. A driver cannot self-clear cash. This workflow records accounting
receipts; it does not transfer money.

The portal uses a single authenticated snapshot for its main refresh, combines
duplicate requests and polls revisions every two seconds while visible.
Existing attendance, ePOD photo/customer PIN and individual password/OTP remain.

Validation: all JavaScript files pass `node --check`; the coordinated backend
passes 91 isolated regressions. A complete live visual check remains pending.
