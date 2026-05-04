"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, Search, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"

interface Document {
  id: string
  title: string
  description: string
  file_size: string
  download_count: number
  file_type: string
  created_at: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('Documents fetch result:', { data, error })
    
    if (error) {
      console.error('Error fetching documents:', error)
    } else {
      setDocuments(data || [])
    }
    setLoading(false)
  }

  const handleDownload = (doc: Document) => {
    // Increment download count in DB
    supabase
      .from('documents')
      .update({ download_count: doc.download_count + 1 })
      .eq('id', doc.id)
      .then(() => fetchDocuments())

    alert(`Simulating download: ${doc.title}`)
  }

  const filtered = documents.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase()) || 
    doc.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen neo-theme text-foreground relative z-10 pt-4">
      {/* Background ambient light */}
      <div className="absolute inset-0 z-[-1] pointer-events-none opacity-40">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/20 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white"
          >
            Building Rules & Documents
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg"
          >
            Access official regulations, procedures and community guidelines
          </motion.p>
        </div>

        {/* Search */}
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input 
            placeholder="Search documents..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/40">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p>Fetching documents from server...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/20">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-10" />
            <p className="text-xl font-medium">No documents found</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}>
                <Card className="glass-effect border-white/10 card-hover overflow-hidden h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/5 flex-shrink-0">
                        <FileText className="h-7 w-7 text-red-400" />
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <h3 className="font-bold text-white text-lg leading-tight group-hover:text-primary transition-colors">{doc.title}</h3>
                        <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">{doc.description}</p>
                      </div>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60">
                            {doc.file_type}
                          </span>
                          <span className="text-xs font-medium text-white/30">{doc.file_size}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-white/30">
                          <Download className="h-3.5 w-3.5" />
                          <span>{doc.download_count}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-medium text-white/20">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Uploaded on {new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>

                      <Button
                        onClick={() => handleDownload(doc)}
                        className="w-full bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/30 hover:text-primary transition-all duration-300 font-bold group"
                      >
                        <Download className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
