/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { getMaterials } from "@/api/dashboard"
import MaterialCard from "@/components/MaterialCard"
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"

const MaterialList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["material-list"],
    queryFn: getMaterials,
  })

  // Handle loading state with skeleton cards
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h2 className="text-2xl font-bold mb-6">Materials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index: number) => (
            <Card key={index} className="animate-pulse bg-gray-100 border-white overflow-hidden">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading materials</p>
          <p className="text-sm">{error.message || "Please try again later"}</p>
        </div>
      </div>
    )
  }

  // Handle empty state
  if (!data?.Materials || data.Materials.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <h2 className="text-2xl font-bold mb-6">Materials</h2>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-8 rounded-lg text-center">
          <p className="font-medium">No materials found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Materials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.Materials.map((material: any, index: number) => (
          <MaterialCard key={material.Id ?? index} product={material} />
        ))}
      </div>
    </div>
  )
}

export default MaterialList
