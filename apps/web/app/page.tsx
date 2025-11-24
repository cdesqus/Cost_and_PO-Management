import { redirect } from "next/navigation";

export default function Home() {
  // Always send landing page traffic to the dashboard route,
  // which is rendered with the full sidebar + menu shell.
  redirect("/dashboard");
}
