"use client";

import { useState, useEffect } from "react";

// Função simples para gerar UUID v4 no browser
function generateUUID() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export function usePredictorUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    let storedId = localStorage.getItem("predictor_user_id");
    let storedName = localStorage.getItem("predictor_user_name");

    if (!storedId) {
      storedId = generateUUID();
      localStorage.setItem("predictor_user_id", storedId);
    }

    setUserId(storedId);
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const saveUserName = (name: string) => {
    localStorage.setItem("predictor_user_name", name);
    setUserName(name);
  };

  return { userId, userName, saveUserName };
}
