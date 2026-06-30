"use client"
import { Home } from "lucide-react"
import { CollectionPageContent } from "@/components/collection-page"

export default function MonthlyCollectionPage() {
  return (
    <CollectionPageContent
      title="Monthly Contribution (Masavari)"
      description="Manage monthly family contributions"
      category="monthly"
      icon={Home}
      iconColor="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
    />
  )
}
