"use client"
import { Heart } from "lucide-react"
import { CollectionPageContent } from "@/components/collection-page"

export default function WeddingCollectionPage() {
  return (
    <CollectionPageContent
      title="Wedding Anniversary Collection"
      description="Manage wedding anniversary fund contributions"
      category="wedding"
      icon={Heart}
      iconColor="bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
    />
  )
}
