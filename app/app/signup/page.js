import { redirect } from 'next/navigation';

// Signup is Google-only. This legacy route now forwards straight to the
// Google sign-in flow; there is no email/password signup UI.
export default function SignupPage() {
  redirect('/login');
}
