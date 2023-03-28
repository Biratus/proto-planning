import { isGet, notFound } from "@/lib/api";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (isGet(req)) {
    console.log("received");
    try {
      const resp = await axios.get("localhost:5000/hello");
      console.log("got response : " + resp.status);
      res.json(resp.data);
    } catch (e) {
      throw e;
    }
  } else notFound(res, "");
}
