"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { imageUrl } from "@/utils/imageUrl"
import { Coffee, Gift, ShoppingBag } from "lucide-react"
import Image from "next/image"

interface ProductProps {
  product: {
    Id: number
    Title: string
    BrandName: string
    SalesPrice: number
    SalesPriceInUsd: number
    CoverPhoto: string | null
    ECardGradient1?: string | null
    ECardGradient2?: string | null
    ECardIconPath?: string | null
  }
}

const stringToColor = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = hash % 360
  return `hsl(${hue}, 70%, 60%)`
}

export default function MaterialCard({ product }: Readonly<ProductProps>) {
  const localPrice = product.SalesPrice.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const usdPrice = product.SalesPriceInUsd.toFixed(2)

  const defaultColor1 = stringToColor(product.Title || product.Id.toString())
  const defaultColor2 = stringToColor((product.Title || product.Id.toString()) + "alt")

  const renderCoverArea = () => {
    if (product.CoverPhoto) {
      return (
        <div className="h-48 relative">
          <Image
            src={imageUrl
              + product.CoverPhoto || "/placeholder.svg"}
            alt={product.Title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )
    }

    if (product.ECardGradient1 && product.ECardGradient2) {
      return (
        <div
          className="h-48 relative flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${product.ECardGradient1} 0%, ${product.ECardGradient2} 100%)`,
          }}
        >
          {!product.ECardIconPath ? (
            <Coffee className="h-24 w-24 text-white opacity-80" />
          ) : (
            <div className="bg-white/20 p-4 rounded-full">
              <Gift className="h-20 w-20 text-white" />
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        className="h-48 relative flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${defaultColor1} 0%, ${defaultColor2} 100%)`,
        }}
      >
        <ShoppingBag className="h-24 w-24 text-white opacity-80" />
      </div>
    )
  }

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      {renderCoverArea()}

      <CardContent className="p-6">
        <div className="mb-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Gift Card
          </Badge>
        </div>

        <h2 className="text-2xl font-bold tracking-tight mt-2">{product.Title}</h2>
        <p className="text-muted-foreground">{product.BrandName}</p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold">{localPrice}</span>
          <span className="text-sm text-muted-foreground">(USD ${usdPrice})</span>
        </div>
      </CardContent>
    </Card>
  )
}
