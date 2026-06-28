import { PublicLayout } from "../../components/public-layout";
import { AuthShell } from "../../components/auth-shell";

export default function SignInPage() {
  return (
    <PublicLayout>
      <AuthShell mode="sign-in" />
    </PublicLayout>
  );
}
