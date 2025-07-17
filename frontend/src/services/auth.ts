import { apiFetch } from "@/utils/api";


export async function loginUser(payload: {email: string, password:string}) {
 return apiFetch('/api/auth/login', {
    method: "POST",
    body: JSON.stringify(payload),
 })
}

export async function signupUser(payload: {
    name: string;
    email: string;
    password: string;
  }) {
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  