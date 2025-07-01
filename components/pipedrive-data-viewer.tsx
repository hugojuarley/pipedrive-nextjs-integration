"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, RefreshCw, Users, DollarSign } from "lucide-react"

interface Deal {
  id: number
  title: string
  value: number
  currency: string
  status: string
  stage_name: string
  person_name: string
  org_name: string
}

interface Person {
  id: number
  name: string
  email: Array<{ value: string; primary: boolean }>
  phone: Array<{ value: string; primary: boolean }>
  org_name: string
}

export default function PipedriveDataViewer() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"deals" | "persons" | "search">("deals")

  const fetchDeals = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/pipedrive/deals?limit=20")
      const data = await response.json()
      if (data.success) {
        setDeals(data.data)
      }
    } catch (error) {
      console.error("Error fetching deals:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPersons = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/pipedrive/persons?limit=20")
      const data = await response.json()
      if (data.success) {
        setPersons(data.data)
      }
    } catch (error) {
      console.error("Error fetching persons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/pipedrive/search?term=${encodeURIComponent(searchTerm)}&type=deals`)
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.data)
        setActiveTab("search")
      }
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === "deals") {
      fetchDeals()
    } else if (activeTab === "persons") {
      fetchPersons()
    }
  }, [activeTab])

  const formatCurrency = (value: number, currency = "BRL") => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
    }).format(value)
  }

  const getPrimaryEmail = (emails: Array<{ value: string; primary: boolean }>) => {
    const primary = emails?.find((e) => e.primary)
    return primary?.value || emails?.[0]?.value || "N/A"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dados do Pipedrive</h1>
        <Button
          onClick={() => (activeTab === "deals" ? fetchDeals() : fetchPersons())}
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button variant={activeTab === "deals" ? "default" : "outline"} onClick={() => setActiveTab("deals")}>
          <DollarSign className="w-4 h-4 mr-2" />
          Deals ({deals.length})
        </Button>
        <Button variant={activeTab === "persons" ? "default" : "outline"} onClick={() => setActiveTab("persons")}>
          <Users className="w-4 h-4 mr-2" />
          Contatos ({persons.length})
        </Button>
        {searchResults.length > 0 && (
          <Button variant={activeTab === "search" ? "default" : "outline"} onClick={() => setActiveTab("search")}>
            <Search className="w-4 h-4 mr-2" />
            Busca ({searchResults.length})
          </Button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Carregando...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Deals Tab */}
          {activeTab === "deals" && (
            <div className="grid gap-4">
              {deals.map((deal) => (
                <Card key={deal.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{deal.title}</h3>
                        <p className="text-sm text-gray-600">
                          {deal.person_name} • {deal.org_name}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {deal.stage_name}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(deal.value, deal.currency)}</p>
                        <Badge
                          variant={deal.status === "open" ? "default" : deal.status === "won" ? "default" : "secondary"}
                        >
                          {deal.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Persons Tab */}
          {activeTab === "persons" && (
            <div className="grid gap-4">
              {persons.map((person) => (
                <Card key={person.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{person.name}</h3>
                        <p className="text-sm text-gray-600">{getPrimaryEmail(person.email)}</p>
                        <p className="text-sm text-gray-600">{person.org_name || "Sem empresa"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{person.phone?.[0]?.value || "Sem telefone"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Search Results Tab */}
          {activeTab === "search" && (
            <div className="grid gap-4">
              {searchResults.map((result) => (
                <Card key={result.id}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold">{result.title}</h3>
                    <p className="text-sm text-gray-600">
                      {result.person_name} • {formatCurrency(result.value, result.currency)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
