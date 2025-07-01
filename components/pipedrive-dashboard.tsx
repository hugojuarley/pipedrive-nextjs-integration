"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Deal {
  id: number
  title: string
  value: number
  currency: string
  status: string
}

export default function PipedriveDashboard() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const fetchDeals = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/pipedrive/deals")
      const data = await response.json()
      setDeals(data.data || [])
    } catch (error) {
      console.error("Error fetching deals:", error)
    } finally {
      setLoading(false)
    }
  }

  const syncData = async () => {
    setSyncing(true)
    try {
      const response = await fetch("/api/pipedrive/sync", {
        method: "POST",
      })
      const result = await response.json()
      if (result.success) {
        await fetchDeals() // Refresh data
      }
    } catch (error) {
      console.error("Error syncing:", error)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pipedrive Dashboard</h1>
        <Button onClick={syncData} disabled={syncing}>
          {syncing ? "Sincronizando..." : "Sincronizar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{deals.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {deals
                .reduce((sum, deal) => sum + deal.value, 0)
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deals Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="space-y-2">
              {deals.slice(0, 5).map((deal) => (
                <div key={deal.id} className="flex justify-between items-center p-2 border rounded">
                  <span>{deal.title}</span>
                  <span className="font-semibold">
                    {deal.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: deal.currency || "BRL",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
