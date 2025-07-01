"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react"

interface JsonViewerProps {
  data: any
  title: string
}

export function JsonViewer({ data, title }: JsonViewerProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState(false)

  const toggleCollapse = (path: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderValue = (value: any, path = "", depth = 0): React.ReactNode => {
    if (value === null) return <span className="text-gray-500">null</span>
    if (value === undefined) return <span className="text-gray-500">undefined</span>
    if (typeof value === "boolean") return <span className="text-blue-600">{value.toString()}</span>
    if (typeof value === "number") return <span className="text-green-600">{value}</span>
    if (typeof value === "string") {
      // Detectar URLs, emails, datas
      if (value.match(/^https?:\/\//)) {
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            "{value}"
          </a>
        )
      }
      if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
        return <span className="text-purple-600">"{value}"</span>
      }
      if (value.includes("@")) {
        return <span className="text-orange-600">"{value}"</span>
      }
      return <span className="text-red-600">"{value}"</span>
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-500">[]</span>

      const isCollapsed = collapsed[path]
      return (
        <div>
          <button
            onClick={() => toggleCollapse(path)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <Badge variant="secondary" className="ml-1">
              Array[{value.length}]
            </Badge>
          </button>
          {!isCollapsed && (
            <div className="ml-4 mt-2 space-y-1">
              {value.map((item, index) => (
                <div key={index} className="flex">
                  <span className="text-gray-400 mr-2">[{index}]:</span>
                  {renderValue(item, `${path}[${index}]`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (typeof value === "object") {
      const keys = Object.keys(value)
      if (keys.length === 0) return <span className="text-gray-500">{"{}"}</span>

      const isCollapsed = collapsed[path]
      return (
        <div>
          <button
            onClick={() => toggleCollapse(path)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <Badge variant="outline" className="ml-1">
              Object ({keys.length} keys)
            </Badge>
          </button>
          {!isCollapsed && (
            <div className="ml-4 mt-2 space-y-1">
              {keys.map((key) => (
                <div key={key} className="flex">
                  <span className="text-blue-800 font-medium mr-2">"{key}":</span>
                  {renderValue(value[key], `${path}.${key}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return <span>{String(value)}</span>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button onClick={copyToClipboard} variant="outline" size="sm">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copiado!" : "Copiar JSON"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 font-mono text-sm">
          {renderValue(data, "root")}
        </div>
      </CardContent>
    </Card>
  )
}
