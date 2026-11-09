// Signup is disabled for now: accounts are created by an admin.
//
// The previous registration form lived in this file. It is available in git history
// and should be restored together with the "Sign up" link in src/app/Login/page.js
// once self-registration is re-enabled.
//
// The backend endpoint (POST /api/accounts/register/) is still public; gate it to
// admins as well if registration should be invite-only at the API level.

import { redirect } from "next/navigation";

export default function SignUp() {
  redirect("/Login");
}
