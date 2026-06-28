import { DashboardPage } from "../../../components/dashboard-page";

export default function SettingsPage() {
  return (
    <DashboardPage
      title="Settings will hold the quiet but important account controls."
      description="This section is reserved for account preferences, workspace controls, privacy references, and support entry points once auth and data ownership are wired in."
      cards={[
        { label: "Account model", value: "Owner first", detail: "Single-user workspace in V1." },
        { label: "Future role", value: "Reviewer", detail: "Read-comment access later if needed." },
        { label: "Admin split", value: "Separate", detail: "Internal content tools stay role-gated." }
      ]}
      listTitle="Planned settings responsibilities"
      listItems={[
        {
          title: "Account settings and session controls",
          detail: "Authentication, email state, password recovery, and logout behavior belong here."
        },
        {
          title: "Workspace references",
          detail: "Business profile shortcuts, legal pages, and support access should be easy to reach from the account menu."
        },
        {
          title: "Growth path",
          detail: "The settings model leaves room for multiple business profiles and reviewer invites later without forcing that complexity into V1."
        }
      ]}
    />
  );
}
