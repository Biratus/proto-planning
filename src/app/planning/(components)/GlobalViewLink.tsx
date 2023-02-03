import { useRouter } from "next/navigation";
import { ArrowLeftCircle } from "react-feather";

export default function GlobalViewLink() {
  const router = useRouter();
  return (
    <button className="btn btn-link btn-outline" onClick={() => router.back()}>
      <ArrowLeftCircle className="mr-2" /> VUE GLOBALE
    </button>
  );
}
