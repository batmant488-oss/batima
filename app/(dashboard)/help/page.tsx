"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  BookOpen,
  ExternalLink,
} from "lucide-react"

const faqs = [
  {
    id: 1,
    question: "How do I submit a maintenance request?",
    answer: "To submit a maintenance request, navigate to the Maintenance page from your dashboard. Click on &apos;New Request&apos;, fill in the details including the issue description, priority level, and preferred time for maintenance.",
    category: "Maintenance",
  },
  {
    id: 2,
    question: "How can I pay my rent online?",
    answer: "You can pay your rent online through the Payments page. We accept various payment methods including credit cards, debit cards, and bank transfers.",
    category: "Payments",
  },
  {
    id: 3,
    question: "What should I do if I lose my keys?",
    answer: "If you lose your keys, immediately contact the building management through the Support page or call our emergency line. For security reasons, we may need to change your lock.",
    category: "Security",
  },
  {
    id: 4,
    question: "How do I update my contact information?",
    answer: "You can update your contact information by visiting your Profile page. Click on 'Edit Profile' and update your phone number, email address, and emergency contacts.",
    category: "Account",
  },
  {
    id: 5,
    question: "What are the quiet hours in the building?",
    answer: "Quiet hours are from 10:00 PM to 7:00 AM on weekdays and 11:00 PM to 8:00 AM on weekends. During these times, please keep noise levels to a minimum.",
    category: "Building Rules",
  },
]

const supportCategories = [
  {
    icon: "🔧",
    title: "Maintenance",
    description: "Repairs and maintenance requests",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: "💳",
    title: "Payments",
    description: "Billing and payment issues",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: "🔒",
    title: "Security",
    description: "Security and access concerns",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: "👤",
    title: "Account",
    description: "Profile and account management",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: "📋",
    title: "Building Rules",
    description: "Policies and regulations",
    color: "bg-amber-100 text-amber-600",
  },
]

const supportChannels = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team",
    availability: "Available 24/7",
    action: "Start Chat",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call our support line",
    availability: "Mon-Fri 9AM-6PM",
    action: "Call Now",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email",
    availability: "Response within 24 hours",
    action: "Send Email",
  },
]

const helpfulResources = [
  {
    icon: BookOpen,
    title: "User Guide",
    description: "Complete guide to using Batima Gest",
    link: "#",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    link: "#",
  },
  {
    icon: FileText,
    title: "Building Handbook",
    description: "Rules and regulations PDF",
    link: "#",
  },
  {
    icon: ExternalLink,
    title: "Emergency Contacts",
    description: "Important phone numbers",
    link: "#",
  },
]

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesCategory
  })

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Support request submitted!")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Help & Support</h1>
          <p className="text-slate-600">Find answers and get the help you need</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Support Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {supportCategories.map((category, index) => (
              <motion.button
                key={category.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.title ? "all" : category.title
                  )
                }
                className={`p-4 rounded-lg border transition-all ${
                  selectedCategory === category.title
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${category.color}`}>
                    <span className="text-xl">{category.icon}</span>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-slate-900 text-sm">
                      {category.title}
                    </h3>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>No FAQs found matching your search.</p>
                  </div>
                ) : (
                  filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="border border-slate-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Badge
                            variant="outline"
                            className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                          >
                            {faq.category}
                          </Badge>
                          <span className="font-medium text-slate-900 text-left text-sm">
                            {faq.question}
                          </span>
                        </div>
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="px-4 pb-4 pt-2 text-slate-600 text-sm leading-relaxed"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Support Channels */}
                <div className="space-y-3">
                  {supportChannels.map((channel, index) => (
                    <motion.div
                      key={channel.title}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                        <channel.icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 text-sm">
                          {channel.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {channel.description}
                        </p>
                        <p className="text-xs text-emerald-600 mt-1">
                          {channel.availability}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`${channel.action}...`)}
                        className="border-slate-200 text-xs"
                      >
                        {channel.action}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Contact Form */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-slate-900 mb-4 text-sm">
                    Send us a message
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Name
                        </label>
                        <Input
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="border-slate-200 h-10"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="border-slate-200 h-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Subject
                      </label>
                      <Input
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="border-slate-200 h-10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white"
                      >
                        <option value="">Select a category</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="payments">Payments</option>
                        <option value="security">Security</option>
                        <option value="account">Account</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Message
                      </label>
                      <textarea
                        placeholder="Describe your issue or question..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full h-24 px-3 py-2 rounded-md border border-slate-200 bg-white resize-none text-sm"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Helpful Resources */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Helpful Resources
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {helpfulResources.map((resource, index) => (
              <motion.a
                key={resource.title}
                href={resource.link}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="group"
              >
                <Card className="border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                        <resource.icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 text-sm">
                          {resource.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      {resource.description}
                    </p>
                    <div className="flex items-center text-emerald-600 text-xs font-medium">
                      View Resource
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Response Time Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <Card className="border-slate-200 bg-emerald-50">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 flex-shrink-0">
                  <Clock className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2 text-sm">
                    Response Times
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-slate-600">
                        <strong className="text-slate-900">Urgent:</strong> Within 2
                        hours
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-slate-600">
                        <strong className="text-slate-900">High:</strong> Within 4
                        hours
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-slate-600">
                        <strong className="text-slate-900">Normal:</strong> Within
                        24 hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
