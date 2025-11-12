"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useAdminAuth } from "@/lib/admin-auth"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Trash2, Edit, Ticket, Sparkles, Download, Image } from "lucide-react"
import Link from "next/link"
import type { Coupon } from "@/lib/types"
import { CouponImageGenerator } from "@/components/coupon-image-generator"
// import { useCouponPDF } from "@/components/coupon-pdf"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CuponesAdminPage() {
  const { isAuthenticated } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // const { generateCouponPDF } = useCouponPDF()

  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [showMachine, setShowMachine] = useState(false)
  const [showCouponDialog, setShowCouponDialog] = useState(false)
  const [generatedCoupon, setGeneratedCoupon] = useState<Coupon | null>(null)
  const [showImageGenerator, setShowImageGenerator] = useState(false)
  const [selectedCouponForImage, setSelectedCouponForImage] = useState<Coupon | null>(null)

  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minPurchase: "",
    maxUses: "",
    expiresAt: "",
    isActive: true
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }
    loadCoupons()
    loadCategories()
  }, [isAuthenticated, router])

  const loadCoupons = async () => {
    try {
      const response = await fetch('/api/coupons')
      if (response.ok) {
        const data = await response.json()
        setCoupons(data)
      }
    } catch (error) {
      console.error('Error loading coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Solo se permiten archivos de imagen",
          variant: "destructive",
        })
        return
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "La imagen debe ser menor a 5MB",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)
      
      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null

    try {
      const formData = new FormData()
      formData.append('file', imageFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        return data.url
      } else {
        throw new Error('Error uploading image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Error",
        description: "No se pudo subir la imagen",
        variant: "destructive",
      })
      return null
    }
  }

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = 'DRIP'
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const playMachineSound = () => {
    try {
      // Verificar si el navegador soporta audio
      if (typeof window === 'undefined' || !window.AudioContext) {
        console.log('[CouponMachine] Audio not supported')
        return
      }

      // Usar un AudioContext global para evitar conflictos
      let audioContext = (window as any).__audioContext
      if (!audioContext) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        audioContext = new AudioContext()
        ;(window as any).__audioContext = audioContext
      }

      // Verificar si el contexto está suspendido
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {
          console.log('[CouponMachine] Could not resume audio context')
          return
        })
      }
      
      // Sonido de "máquina trabajando"
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 200
      oscillator.type = 'square'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
      
      // Sonido de "ding" al final
      setTimeout(() => {
        try {
          const oscillator2 = audioContext.createOscillator()
          const gainNode2 = audioContext.createGain()
          
          oscillator2.connect(gainNode2)
          gainNode2.connect(audioContext.destination)
          
          oscillator2.frequency.value = 800
          oscillator2.type = 'sine'
          
          gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          
          oscillator2.start(audioContext.currentTime)
          oscillator2.stop(audioContext.currentTime + 0.3)
        } catch (error) {
          console.log('[CouponMachine] Second sound error:', error)
        }
      }, 500)
    } catch (error) {
      console.log('[CouponMachine] Audio error:', error)
      // Continuar sin sonido si hay error
    }
  }

  const handleGenerateCoupon = async () => {
    if (!form.name || !form.discountValue) {
      toast({
        title: "Error",
        description: "Completa al menos el nombre y valor del descuento",
        variant: "destructive",
      })
      return
    }

    setGenerating(true)
    setShowMachine(true)
    
    // Reproducir sonido
    playMachineSound()

    // Generar código automático si no hay uno
    const code = form.code || generateRandomCode()

    // Animación de la máquina (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      // Subir imagen si existe
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage()
      }

      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          code,
          discountValue: parseFloat(form.discountValue),
          minPurchase: form.minPurchase ? parseFloat(form.minPurchase) : 0,
          maxUses: form.maxUses ? parseInt(form.maxUses) : null,
          expiresAt: form.expiresAt || null,
          categories: selectedCategories,
          imageUrl: imageUrl
        })
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedCoupon(data.coupon)
        setShowCouponDialog(true)
        
        toast({
          title: "¡Cupón generado!",
          description: `Código: ${data.coupon.code}`,
        })

        // Resetear formulario
        setForm({
          code: "",
          name: "",
          description: "",
          discountType: "percentage",
          discountValue: "",
          minPurchase: "",
          maxUses: "",
          expiresAt: "",
          isActive: true
        })
        setSelectedCategories([])
        setImageFile(null)
        setImagePreview("")

        // Recargar cupones
        loadCoupons()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "No se pudo crear el cupón",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al generar cupón",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
      setTimeout(() => setShowMachine(false), 500)
    }
  }

  const handleDeleteCoupon = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este cupón?')) return

    try {
      const response = await fetch(`/api/coupons?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Cupón eliminado",
          description: "El cupón ha sido eliminado exitosamente",
        })
        loadCoupons()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el cupón",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const response = await fetch('/api/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: coupon.id,
          isActive: !coupon.isActive
        })
      })

      if (response.ok) {
        toast({
          title: coupon.isActive ? "Cupón desactivado" : "Cupón activado",
        })
        loadCoupons()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el cupón",
        variant: "destructive",
      })
    }
  }

  const handleEditCoupon = (coupon: Coupon) => {
    // Cargar datos del cupón en el formulario
    setForm({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minPurchase: coupon.minPurchase.toString(),
      maxUses: coupon.maxUses?.toString() || "",
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : "",
      isActive: coupon.isActive
    })
    
    // Cargar categorías seleccionadas
    setSelectedCategories(coupon.categories || [])
    
    // Si tiene imagen, cargar preview
    if (coupon.imageUrl) {
      setImagePreview(coupon.imageUrl)
    }
    
    // Scroll al formulario
    document.getElementById('coupon-form')?.scrollIntoView({ behavior: 'smooth' })
    
    toast({
      title: "Cupón cargado",
      description: "Puedes editar los datos y generar un nuevo cupón",
    })
  }

  const downloadCouponPDF = async (coupon: Coupon) => {
    // TODO: Implementar generación de PDF
    toast({
      title: "Próximamente",
      description: "La generación de PDF estará disponible pronto",
    })
  }

  const handleGenerateImage = (coupon: Coupon) => {
    setSelectedCouponForImage(coupon)
    setShowImageGenerator(true)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/productos">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Productos
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎟️ Generador de Cupones</h1>
          <p className="text-gray-600">Crea y gestiona cupones de descuento para tus clientes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Máquina de Cupones */}
          <Card id="coupon-form" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-6 w-6 text-purple-600" />
                Máquina de Cupones
              </CardTitle>
              <CardDescription>
                Configura y genera cupones con un click
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Código (opcional)</Label>
                  <Input
                    id="code"
                    placeholder="Auto-generado"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    maxLength={20}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Black Friday"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción del cupón..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountType">Tipo de Descuento</Label>
                  <Select
                    value={form.discountType}
                    onValueChange={(value: "percentage" | "fixed") => setForm({ ...form, discountType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                      <SelectItem value="fixed">Monto Fijo ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discountValue">Valor *</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    placeholder={form.discountType === 'percentage' ? '0-100' : 'Monto'}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPurchase">Compra Mínima</Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    placeholder="0"
                    value={form.minPurchase}
                    onChange={(e) => setForm({ ...form, minPurchase: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxUses">Usos Máximos</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    placeholder="Ilimitado"
                    value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="expiresAt">Fecha de Expiración</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
              </div>

              {/* Selector de Categorías */}
              <div>
                <Label>Categorías Aplicables (opcional)</Label>
                <div className="mt-2 space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category])
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== category))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Dejar vacío para aplicar a todas las categorías
                </p>
              </div>

              {/* Upload de Imagen */}
              <div>
                <Label htmlFor="image">Imagen del Cupón (opcional)</Label>
                <div className="mt-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG o JPG, máximo 5MB
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Cupón Activo</Label>
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                />
              </div>

              {/* Botón de Generar con Animación */}
              <div className="relative">
                <Button
                  onClick={handleGenerateCoupon}
                  disabled={generating}
                  className="w-full h-16 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                >
                  {generating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Generando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6" />
                      ¡GENERAR CUPÓN!
                      <Sparkles className="h-6 w-6" />
                    </div>
                  )}
                </Button>

                {/* Animación de la Máquina */}
                {showMachine && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg">
                    <div className="text-center">
                      <div className="text-6xl animate-bounce mb-4">🎰</div>
                      <div className="flex gap-2 justify-center">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lista de Cupones */}
          <Card>
            <CardHeader>
              <CardTitle>Cupones Activos</CardTitle>
              <CardDescription>
                {coupons.length} cupones creados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : coupons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay cupones creados aún</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-600 text-white font-mono">
                              {coupon.code}
                            </Badge>
                            {!coupon.isActive && (
                              <Badge variant="outline" className="text-gray-500">
                                Inactivo
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mt-1">{coupon.name}</h4>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCoupon(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {coupon.publicUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/cupon/${coupon.publicUrl}`, '_blank')}
                            >
                              <Ticket className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadCouponPDF(coupon)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% de descuento`
                          : `$${coupon.discountValue.toLocaleString()} de descuento`}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          Usos: {coupon.currentUses}
                          {coupon.maxUses && ` / ${coupon.maxUses}`}
                        </span>
                        <Switch
                          checked={coupon.isActive}
                          onCheckedChange={() => handleToggleActive(coupon)}
                          className="scale-75"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Cupones Completa */}
        <Card>
          <CardHeader>
            <CardTitle>Todos los Cupones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descuento</TableHead>
                    <TableHead>Usos</TableHead>
                    <TableHead>Expira</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                      <TableCell>{coupon.name}</TableCell>
                      <TableCell>
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `$${coupon.discountValue.toLocaleString()}`}
                      </TableCell>
                      <TableCell>
                        {coupon.currentUses}
                        {coupon.maxUses && ` / ${coupon.maxUses}`}
                      </TableCell>
                      <TableCell>
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString()
                          : 'Sin límite'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={coupon.isActive ? "default" : "outline"}>
                          {coupon.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateImage(coupon)}
                            title="Generar imagen del cupón"
                          >
                            <Image className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadCouponPDF(coupon)}
                            title="Descargar PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCoupon(coupon)}
                            title="Editar cupón"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            title="Eliminar cupón"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Cupón Generado */}
      <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">🎉 ¡Cupón Generado!</DialogTitle>
            <DialogDescription className="text-center">
              Tu cupón ha sido creado exitosamente
            </DialogDescription>
          </DialogHeader>
          {generatedCoupon && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6 text-center">
                <p className="text-sm opacity-90 mb-2">Código del Cupón</p>
                <p className="text-3xl font-bold font-mono tracking-wider">
                  {generatedCoupon.code}
                </p>
                <p className="text-sm opacity-90 mt-4">
                  {generatedCoupon.discountType === 'percentage'
                    ? `${generatedCoupon.discountValue}% de descuento`
                    : `$${generatedCoupon.discountValue.toLocaleString()} de descuento`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCoupon.code)
                    toast({
                      title: "Copiado",
                      description: "Código copiado al portapapeles",
                    })
                  }}
                >
                  Copiar Código
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => downloadCouponPDF(generatedCoupon)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Generador de Imágenes */}
      {showImageGenerator && selectedCouponForImage && (
        <CouponImageGenerator
          coupon={selectedCouponForImage}
          onClose={() => {
            setShowImageGenerator(false)
            setSelectedCouponForImage(null)
          }}
        />
      )}
    </div>
  )
}

