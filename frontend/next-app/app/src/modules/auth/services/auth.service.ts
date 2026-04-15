import type { LoginResponse } from "@/app/src/modules/types/auth.types";

export async function loginService(data: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}
