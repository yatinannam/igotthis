import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { signUpAction } from "@/actions/auth";
import { getSessionUser } from "@/lib/session";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";

export default async function SignUpPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <Container className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-block text-sm font-medium text-purple-400 hover:text-purple-300"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-white">Get started</h1>
          <p className="text-slate-400">Create your account in seconds</p>
        </div>

        <Card variant="elevated">
          <AuthForm mode="signup" action={signUpAction} />
        </Card>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </Container>
    </main>
  );
}
