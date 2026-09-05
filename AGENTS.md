# Developer instructions

Read README.md before changing this application. The backend is a separate repository, breathIQ/co2body-api; preserve its token format and response envelopes. The default API constant points at production. Stage explicit paths, keep credentials out of browser code, and update README.md when routes, configuration, auth storage or API contracts change. Regenerate docs/SOURCE_REFERENCE.md with node scripts/documentation-index.mjs. Match verification to the affected flow; the starter App.test.js is not adequate product coverage.
