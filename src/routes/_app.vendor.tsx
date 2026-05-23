import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/vendor")({
  head: () => ({ meta: [{ title: "Vendor — Rented" }] }),
  component: VendorLayout,
});

function VendorLayout() {
  // Pure passthrough — child routes own their own headers, and the
  // mode-aware bottom nav handles navigation between vendor pages.
  return <Outlet />;
}
