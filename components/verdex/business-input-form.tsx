"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BusinessInputFormProps {
  onSubmit: (data: BusinessFormData) => void
  isLoading: boolean
}

export interface BusinessFormData {
  description: string
  businessType: string
  businessStage: string
  userProfile: string
  budgetRange: string
}

const businessTypes = [
  "SaaS",
  "E-commerce",
  "Service-based",
  "Marketplace",
  "Content / Media",
  "Other",
]

const businessStages = [
  "Idea only",
  "MVP",
  "Early traction",
  "Revenue-generating",
]

const userProfiles = [
  "Student",
  "Working professional",
  "Founder",
  "Freelancer",
  "Other",
]

const budgetRanges = [
  "$0 - $1,000",
  "$1,000 - $10,000",
  "$10,000 - $50,000",
  "$50,000+",
]

export function BusinessInputForm({ onSubmit, isLoading }: BusinessInputFormProps) {
  const [formData, setFormData] = useState<BusinessFormData>({
    description: "",
    businessType: "",
    businessStage: "",
    userProfile: "",
    budgetRange: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isFormValid =
    formData.description.trim().length > 0 &&
    formData.businessType &&
    formData.businessStage &&
    formData.userProfile &&
    formData.budgetRange

  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-medium text-foreground">
              Describe your business idea
            </Label>
            <Textarea
              id="description"
              placeholder="Explain what your business does, who it's for, and what problem it solves..."
              className="min-h-[180px] resize-none text-base leading-relaxed bg-background border-border focus:border-primary"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="businessType" className="text-base font-medium text-foreground">
                Business Type
              </Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) =>
                  setFormData({ ...formData, businessType: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger id="businessType" className="bg-background">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="businessStage" className="text-base font-medium text-foreground">
                Business Stage
              </Label>
              <Select
                value={formData.businessStage}
                onValueChange={(value) =>
                  setFormData({ ...formData, businessStage: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger id="businessStage" className="bg-background">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {businessStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="userProfile" className="text-base font-medium text-foreground">
                Your Profile
              </Label>
              <Select
                value={formData.userProfile}
                onValueChange={(value) =>
                  setFormData({ ...formData, userProfile: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger id="userProfile" className="bg-background">
                  <SelectValue placeholder="Select profile" />
                </SelectTrigger>
                <SelectContent>
                  {userProfiles.map((profile) => (
                    <SelectItem key={profile} value={profile}>
                      {profile}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="budgetRange" className="text-base font-medium text-foreground">
                Budget Range
              </Label>
              <Select
                value={formData.budgetRange}
                onValueChange={(value) =>
                  setFormData({ ...formData, budgetRange: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger id="budgetRange" className="bg-background">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-medium h-12"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Analyzing..." : "Generate Analysis"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
