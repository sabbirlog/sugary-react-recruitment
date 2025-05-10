"use client"

import { getMaterials } from "@/api/dashboard"
import MaterialCard from "@/components/MaterialCard"
import { Card } from "@/components/ui/card"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

const LIMIT = 12

const MaterialList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["material-list"],
    queryFn: ({ pageParam = 0 }) =>
      getMaterials({ Skip: pageParam, Limit: LIMIT, Types: [1] }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.flatMap(p => p.Materials || []).length
      return lastPage.Materials?.length === LIMIT ? totalLoaded : undefined
    },
  })

  const observerRef = useRef<HTMLDivElement | null>(null)

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) fetchNextPage()
      },
      { threshold: 1 }
    )

    observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [observerRef.current, hasNextPage])

  const materials = data?.pages.flatMap(page => page.Materials || []) || []

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

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading materials</p>
          <p className="text-sm">{(error).message ?? "Please try again later"}</p>
        </div>
      </div>
    )
  }

  if (materials.length === 0) {
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
        {materials.map((material, index: number) => (
          <MaterialCard key={material.Id ?? index} product={material} />
        ))}
      </div>

      {hasNextPage && (
        <div ref={observerRef} className="text-center mt-6">
          {isFetchingNextPage ? (
            <p className="text-gray-500">Loading more...</p>
          ) : (
            <p className="text-gray-400">Scroll down to load more</p>
          )}
        </div>
      )}
    </div>
  )
}

export default MaterialList
