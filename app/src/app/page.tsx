import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/login">Login</Link>
      <Link href="/signup">Signup</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/editor">Editor</Link>
    </div>
  );
}
