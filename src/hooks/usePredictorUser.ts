"use client";

import { useState, useEffect } from "react";

function generateUUID() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: string) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16)
  );
}

export function usePredictorUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    let storedId = localStorage.getItem("predictor_user_id");
    const storedName = localStorage.getItem("predictor_user_name");

    if (!storedId) {
      storedId = generateUUID();
      localStorage.setItem("predictor_user_id", storedId);
    }

    setTimeout(() => {
      setUserId(storedId);
      if (storedName) {
        setUserName(storedName);
      }
    }, 0);
  }, []);

  const saveUserName = (name: string) => {
    localStorage.setItem("predictor_user_name", name);
    setUserName(name);
  };

  return { userId, userName, saveUserName };
}
