import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#fef3c7_0%,transparent_40%),radial-gradient(circle_at_80%_10%,#fde68a_0%,transparent_35%),linear-gradient(160deg,#fffdf4_0%,#fff7d6_45%,#fef3c7_100%)] px-4 py-10">
      <div className="pointer-events-none absolute -left-20 top-24 h-60 w-60 rounded-full bg-amber-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-orange-300/25 blur-3xl" />
      <Outlet />
    </div>
  );
}
