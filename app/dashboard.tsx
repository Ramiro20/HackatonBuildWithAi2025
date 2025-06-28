"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Droplets,
  Lightbulb,
  Camera,
  Thermometer,
  Bell,
  User,
  LogOut,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Power,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardProps {
  user: string
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [temperature, setTemperature] = useState(24)
  const [humidity, setHumidity] = useState(65)
  const [isIrrigating, setIsIrrigating] = useState(false)
  const [lightsOn, setLightsOn] = useState(false)
  const [lastIrrigation, setLastIrrigation] = useState<Date | null>(null)
  const [notifications, setNotifications] = useState<string[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  // Simular cambios de temperatura
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((prev) => {
        const change = (Math.random() - 0.5) * 2
        return Math.max(15, Math.min(35, prev + change))
      })
      setHumidity((prev) => {
        const change = (Math.random() - 0.5) * 4
        return Math.max(30, Math.min(90, prev + change))
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Verificar si necesita riego
  useEffect(() => {
    const checkIrrigation = () => {
      if (!lastIrrigation) {
        setNotifications((prev) => [...prev, "⚠️ No se ha realizado riego inicial"])
        return
      }

      const now = new Date()
      const timeDiff = now.getTime() - lastIrrigation.getTime()
      const hoursDiff = timeDiff / (1000 * 3600)

      if (hoursDiff > 8) {
        setNotifications((prev) => [...prev, `⚠️ Último riego hace ${Math.floor(hoursDiff)} horas`])
      }
    }

    const interval = setInterval(checkIrrigation, 30000) // Verificar cada 30 segundos
    checkIrrigation() // Verificar inmediatamente

    return () => clearInterval(interval)
  }, [lastIrrigation])

  const handleIrrigation = async () => {
    setIsIrrigating(true)
    setNotifications((prev) => [...prev, "💧 Iniciando sistema de riego..."])

    setTimeout(() => {
      setIsIrrigating(false)
      setLastIrrigation(new Date())
      setNotifications((prev) => [...prev, "✅ Riego completado exitosamente"])
    }, 3000)
  }

  const toggleLights = () => {
    setLightsOn(!lightsOn)
    setNotifications((prev) => [...prev, `💡 Luces ${!lightsOn ? "encendidas" : "apagadas"}`])
  }

  const openCameras = () => {
    setNotifications((prev) => [...prev, "📹 Abriendo vista de cámaras..."])
    // Aquí se abriría la vista de cámaras
  }

  const clearNotifications = () => {
    setNotifications([])
    setShowNotifications(false)
  }

  const getTemperatureColor = (temp: number) => {
    if (temp < 18) return "text-blue-600"
    if (temp < 25) return "text-green-600"
    if (temp < 30) return "text-yellow-600"
    return "text-red-600"
  }

  const getTemperatureStatus = (temp: number) => {
    if (temp < 18) return "Frío"
    if (temp < 25) return "Óptimo"
    if (temp < 30) return "Cálido"
    return "Caliente"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Green Power</h1>
                <p className="text-sm text-gray-500">Sistema de Control Domótico</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notificaciones */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">Notificaciones</h3>
                        <Button variant="ghost" size="sm" onClick={clearNotifications}>
                          Limpiar
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-gray-500 text-sm">No hay notificaciones</p>
                        ) : (
                          notifications
                            .slice(-5)
                            .reverse()
                            .map((notification, index) => (
                              <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                                {notification}
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Usuario */}
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user}</span>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Temperatura */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperatura</CardTitle>
              <Thermometer className={cn("h-4 w-4", getTemperatureColor(temperature))} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className={getTemperatureColor(temperature)}>{temperature.toFixed(1)}°C</span>
              </div>
              <p className="text-xs text-muted-foreground">Estado: {getTemperatureStatus(temperature)}</p>
              <Progress value={(temperature / 40) * 100} className="mt-2" />
            </CardContent>
          </Card>

          {/* Humedad */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humedad</CardTitle>
              <Droplets className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{humidity.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                {humidity > 70 ? "Alta" : humidity > 50 ? "Óptima" : "Baja"}
              </p>
              <Progress value={humidity} className="mt-2" />
            </CardContent>
          </Card>

          {/* Estado del Sistema */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Activo</div>
              <p className="text-xs text-muted-foreground">
                Último riego: {lastIrrigation ? lastIrrigation.toLocaleTimeString() : "Pendiente"}
              </p>
              <div className="flex space-x-2 mt-2">
                <Badge variant={lightsOn ? "default" : "secondary"}>Luces {lightsOn ? "ON" : "OFF"}</Badge>
                <Badge variant={isIrrigating ? "default" : "secondary"}>Riego {isIrrigating ? "ON" : "OFF"}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Riego */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <span>Sistema de Riego</span>
              </CardTitle>
              <CardDescription>Control del sistema de irrigación automático</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleIrrigation}
                disabled={isIrrigating}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isIrrigating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Regando...
                  </>
                ) : (
                  <>
                    <Droplets className="mr-2 h-4 w-4" />
                    Iniciar Riego
                  </>
                )}
              </Button>
              {lastIrrigation && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Último riego: {lastIrrigation.toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Luces */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className={cn("h-5 w-5", lightsOn ? "text-yellow-500" : "text-gray-400")} />
                <span>Iluminación</span>
              </CardTitle>
              <CardDescription>Control de las luces LED del invernadero</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={toggleLights}
                className={cn(
                  "w-full",
                  lightsOn ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-600 hover:bg-gray-700",
                )}
                size="lg"
              >
                <Power className="mr-2 h-4 w-4" />
                {lightsOn ? "Apagar Luces" : "Encender Luces"}
              </Button>
              <div className="flex justify-center mt-2">
                <Badge variant={lightsOn ? "default" : "secondary"}>{lightsOn ? "Encendidas" : "Apagadas"}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Cámaras */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-purple-500" />
                <span>Cámaras</span>
              </CardTitle>
              <CardDescription>Visualización en tiempo real del invernadero</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={openCameras} className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                <Eye className="mr-2 h-4 w-4" />
                Ver Cámaras
              </Button>
              <div className="flex justify-center mt-2">
                <Badge variant="outline">4 cámaras activas</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas */}
        {notifications.length > 0 && (
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                <span>Alertas Recientes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.slice(-3).map((notification, index) => (
                  <div key={index} className="text-sm text-orange-700 bg-white p-2 rounded">
                    {notification}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
