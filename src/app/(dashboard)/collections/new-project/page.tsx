"use client"
import { Hammer } from "lucide-react"
import { CollectionPageContent } from "@/components/collection-page"

export default function NewProjectCollectionPage() {
  return (
    <CollectionPageContent
      title="New Project Fund"
      description="Manage new church building project contributions"
      category="new-project"
      icon={Hammer}
      iconColor="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
    />
  )
}
