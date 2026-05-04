"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar } from "lucide-react"

const documents = [
  { id: "d1", title: "Building Rules & Regulations", description: "Complete guide to building policies and resident responsibilities.", type: "PDF", size: "2.4 MB", date: "2024-04-15T10:00:00Z", downloads: 156 },
  { id: "d2", title: "Community Guidelines", description: "Guidelines for community living and shared spaces.", type: "PDF", size: "890 KB", date: "2024-03-28T14:00:00Z", downloads: 123 },
  { id: "d3", title: "Emergency Procedures", description: "Important procedures for emergency situations.", type: "PDF", size: "1.2 MB", date: "2024-04-01T11:00:00Z", downloads: 89 },
  { id: "d4", title: "Pet Policy", description: "Rules and regulations regarding pets in the building.", type: "PDF", size: "456 KB", date: "2024-03-15T09:00:00Z", downloads: 67 },
  { id: "d5", title: "Parking Rules", description: "Parking regulations and assigned spaces information.", type: "PDF", size: "678 KB", date: "2024-02-20T14:00:00Z", downloads: 45 }
]

export default function DocumentsPage() {
  const handleDownload = (id: string) => {
    const doc = documents.find(d => d.id === id)
    if (doc) {
      alert(`Downloading: ${doc.title}`)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Building Rules & Documents</h1>
          <p className="text-slate-600">Access building rules and important documents</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Documents Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}>
              <Card className="border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                      <FileText className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight">{doc.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{doc.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {doc.type}
                      </span>
                      <span className="text-xs text-slate-500">{doc.size}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Download className="h-3 w-3" />
                      <span>{doc.downloads}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(doc.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc.id)}
                    className="w-full border-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-colors text-xs">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
