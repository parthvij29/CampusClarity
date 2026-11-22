# CampusClarity web prototype

Open the [live CampusClarity prototype](https://campus-clarity-xo49.vercel.app/) on Vercel.

Run from this directory with `npm ci` and `npm run dev`. Use `npm run build` for a production bundle and `npm run lint` for static checks.

The web demo runs entirely in the browser. It matches supported question patterns against the bundled sample handbook and returns either an answer with an exact quote and section ID or a referral to the Academic Office. The handbook view supports keyword search, topic filters and direct navigation from a citation.

The sample text lives in `src/data/student_handbook.json`. Review the rule mappings in `src/utils/engine.js` whenever section IDs or the order of clauses changes. The repository's separate Python and prompt files hold the model experiment.
