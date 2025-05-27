import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardAuthWrapper from "@/components/layouts/DashboardAuthWrapper";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthWrapper>
      <DashboardLayout>{children}</DashboardLayout>
    </DashboardAuthWrapper>
  );
}
