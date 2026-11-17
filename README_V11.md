# Driver portal v11

Deploy the matching dairy-backend v11 change first. Read its UPGRADE_V11.md.

Profile now uses an account menu with earnings/wallet, assigned incentive
instructions, performance/ratings, vehicle/private documents, notifications,
contact editing and safety/language/display/sound settings. Sign out is at its
bottom. SOS and language controls move out of the header into Profile.

Each running order has failed-attempt reporting (active shift required) and
customer chat. The Manifest shows the driver's coordinate stop map and road
navigation links, without any profit/cost fields in the driver API response.

Incentive completion is submitted for manager review. Only approved rewards
credit earnings. Net available earnings subtract outstanding COD cash, other
deductions, paid payouts and pending reservations. Cash/bank payout requests
need accounts approval and recorded actual payment; the portal does not move
bank funds. Full bank credentials are not collected.

Documents are private, expire with visible tracking and retain renewal history.
Ratings use real delivered-order customer reviews. Configure depot/delivery pins
and admin pay rules before those features have data.

New assets: workspace.js/css and workforce.js/css. Main refreshes use a scoped
snapshot with visible revision checks every 1.5 seconds and no paid realtime
service. Attendance, PIN/photo/COD confirmation and v10 cash receipts remain.
