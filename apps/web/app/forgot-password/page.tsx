import { PublicLayout } from "../../components/public-layout";
import { AuthShell } from "../../components/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <PublicLayout>
      <AuthShell mode="reset" />
    </PublicLayout>
  );
}
