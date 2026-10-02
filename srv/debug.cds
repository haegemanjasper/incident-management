// DEBUG ONLY – returns the raw JWT of the logged-in user.
// Used to verify IAS group → role collection mapping (checklist step 06).
// Do NOT enable in production: exposes the user's access token.

// service DebugService @(requires: 'authenticated-user') {
//   function token() returns String;
// }