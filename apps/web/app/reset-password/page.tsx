import { PublicLayout } from "../../components/public-layout";
import { AuthShell } from "../../components/auth-shell";

export default function ResetPasswordPage() {
  return (
    <PublicLayout>
      <AuthShell mode="reset" />
    </PublicLayout>
  );
}
