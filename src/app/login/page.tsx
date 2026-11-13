import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Sign in · Folio" };

export default function LoginPage() {
  return <AuthForm mode="signIn" />;
}
