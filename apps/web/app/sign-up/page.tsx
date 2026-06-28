import { PublicLayout } from "../../components/public-layout";
import { AuthShell } from "../../components/auth-shell";

export default function SignUpPage() {
  return (
    <PublicLayout>
      <AuthShell mode="sign-up" />
    </PublicLayout>
  );
}
