import { FiliereParamPage } from "./page";

export default function Head({ params: { filiereId } }: FiliereParamPage) {
  return (
    <>
      <title>{filiereId}</title>
    </>
  );
}
