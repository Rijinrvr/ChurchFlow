"use client"
import { Cake } from "lucide-react"
import { CollectionPageContent } from "@/components/collection-page"

export default function BirthdayCollectionPage() {
  return (
    <CollectionPageContent
      title="Birthday Collection"
      description="Manage birthday fund contributions"
      category="birthday"
      icon={Cake}
      iconColor="bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400"
    />
  )
}
