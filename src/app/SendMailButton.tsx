"use client";

import axios from "axios";
import { useCallback } from "react";

export default function SendMailButton() {
  const sendMail = useCallback(async () => {
    try {
      const resp = await axios.post("/api/send-mail");
      console.log(resp);
    } catch (e) {
      throw e;
    }
  }, []);
  return (
    <button className="btn" onClick={sendMail}>
      Send Mail
    </button>
  );
}
