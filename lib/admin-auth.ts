"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AdminAuthStore {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

export const useAdminAuth = create<AdminAuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (username: string, password: string) => {
        const validUser = "natoh"
        const validPass = "Federyco88$"

        if (username === validUser && password === validPass) {
          set({ isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: "admin-auth",
    },
  ),
)
