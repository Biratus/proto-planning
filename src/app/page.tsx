import Link from "next/link";
import SendMailButton from "./SendMailButton";

export default function Home() {
  return (
    <>
      <Link href="/planning" prefetch={false}>
        Planning
      </Link>
      <SendMailButton />
    </>
  );
}
