# Copilot Frontend Context: Academix (Next.js + Better Auth)

This file defines the full context for scaffolding the **Next.js frontend** of the Academix platform using Copilot. Save as `/frontend/copilot-context.md`.

---

## 1. Stack & Libraries

- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS + Shadcn/ui
- **Auth**: NextAuth.js with JWT + Refresh Token strategy
- **State Management**: Zustand (for auth/session)
- **API Client**: Axios with interceptors
- **Forms & Validation**: React Hook Form + Zod
- **Deployment**: Vercel (dev) or Docker

---

## 2. Folder Structure

```
/frontend
├── app
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   ├── login
│   │   └── page.tsx           # Login form
│   ├── register
│   │   └── page.tsx           # Register form
│   ├── dashboard
│       └── page.tsx           # User dashboard
│
├── components
│   ├── Navbar.tsx
│   ├── AuthGuard.tsx
│   └── Loading.tsx
│
├── lib
│   ├── axios.ts               # Axios base + interceptors
│   ├── auth.ts                # Refresh + token helpers
│   └── zodSchemas.ts          # Zod form schemas
│
├── store
│   └── useAuth.ts             # Zustand auth store
│
├── styles
│   └── globals.css
│
├── middleware.ts              # Middleware to protect routes
├── tailwind.config.js
├── tsconfig.json
└── .env.local.example         # Env template
```

---

## 3. Auth Implementation (NextAuth.js + Custom Strategy)

### `/lib/auth.ts`

```ts
import axios from "./axios";
import jwtDecode from "jwt-decode";

export const refreshAccessToken = async (refreshToken: string) => {
  const res = await axios.post("/auth/refresh", { refreshToken });
  return res.data;
};

export const decodeToken = (token: string) => jwtDecode(token);
```

---

### `/store/useAuth.ts`

```ts
import { create } from "zustand";

interface AuthState {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setAuth: ({ accessToken, refreshToken }) => {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    set({ user: payload, accessToken, refreshToken });
  },
  logout: () => set({ user: null, accessToken: null, refreshToken: null }),
}));
```

---

### `/lib/axios.ts`

```ts
import axios from "axios";
import { useAuth } from "@/store/useAuth";
import { refreshAccessToken } from "./auth";

const instance = axios.create({ baseURL: "http://localhost:3000/api" });

instance.interceptors.request.use((config) => {
  const token = useAuth.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response.status === 403 && !original._retry) {
      original._retry = true;
      const tokens = await refreshAccessToken(useAuth.getState().refreshToken!);
      useAuth.getState().setAuth(tokens);
      original.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return axios(original);
    }
    return Promise.reject(err);
  }
);

export default instance;
```

---

## 4. Pages Overview

### `/app/login/page.tsx`

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/zodSchemas";
import axios from "@/lib/axios";
import { useAuth } from "@/store/useAuth";

export default function LoginPage() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const setAuth = useAuth((s) => s.setAuth);

  const onSubmit = async (data) => {
    const res = await axios.post("/auth/login", data);
    setAuth(res.data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      <input {...register("password")} placeholder="Password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 5. Instructions to Copilot

> Use this context to scaffold a Next.js 14 App Router frontend integrated with the backend provided in the sibling context.
>
> 1. Implement all pages using `app/` directory.
> 2. Use Zustand to manage user auth state globally.
> 3. Add Axios interceptors to refresh access tokens on 403.
> 4. All protected pages should use `AuthGuard.tsx`.
> 5. Use `react-hook-form` and Zod for validation.
> 6. Pages: Login, Register, Dashboard, Profile, Post Feed, Course List, etc.
> 7. Use Shadcn/ui and TailwindCSS components.
