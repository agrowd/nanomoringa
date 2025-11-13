"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAdminAuth } from "@/lib/admin-auth"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { isAuthenticated, login } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const success = login(username, password)

    if (success) {
      toast({
        title: "Acceso concedido",
        description: "Bienvenido al panel de administración",
      })
      router.push("/admin/dashboard")
    } else {
      toast({
        title: "Error de autenticación",
        description: "Usuario o contraseña incorrectos",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/brand/medicina-natural-logo.png" alt="Medicina Natural" width={60} height={60} className="h-16 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Panel de Administración</CardTitle>
          <CardDescription className="text-gray-600">Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-900 font-semibold">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-900 font-semibold">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
