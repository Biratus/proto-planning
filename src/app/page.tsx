import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/planning" prefetch={false}>
        Planning
      </Link>
    </>
  );
}
