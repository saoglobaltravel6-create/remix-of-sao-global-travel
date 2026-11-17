import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/radar")({ component: () => <Outlet /> });
