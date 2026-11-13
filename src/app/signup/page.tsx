import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Create account · Folio" };

export default function SignupPage() {
  return <AuthForm mode="signUp" />;
}
