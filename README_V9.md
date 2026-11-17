# First Milk Venture v9 — Delivery portal

The shared authentication gate remains consistent with Admin and Customer.
Existing driver actions continue to drive customer email events on the v9 backend:
Picked Up → shipped; In Transit/Arrived → out for delivery; validated ePOD → delivered.

Deploy [dairy-backend](https://github.com/raseenup/dairy-backend) v9 first. Its
`UPGRADE_V9.md` contains full deployment and email configuration instructions.
Publish all changed files together and keep `config.js` pointed at the backend.

Validation: JavaScript syntax checks and isolated DOM/API smoke checks passed.
A browser preview was blocked by the environment URL policy; actual mobile
rendering was not visually verified.
