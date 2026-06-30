"use client"
import { HeartHandshake } from "lucide-react"
import { CollectionPageContent } from "@/components/collection-page"

export default function DonationsCollectionPage() {
  return (
    <CollectionPageContent
      title="Donations"
      description="Manage general donations and contributions"
      category="donation"
      icon={HeartHandshake}
      iconColor="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
    />
  )
}
