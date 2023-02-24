import Link from "next/link";
import { ArrowLeftCircle } from "react-feather";

export default function GlobalViewLink() {
  return (
    <Link
      className="btn-outline btn-link btn"
      href="/planning"
      prefetch={false}
    >
      <ArrowLeftCircle className="mr-2" /> VUE GLOBALE
    </Link>
  );
}
