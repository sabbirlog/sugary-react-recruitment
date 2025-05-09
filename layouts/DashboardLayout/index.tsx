'use client'

import { DashboardHeader } from "@/components/DashboardHeader"

const DashboardLayout = ({
    children
}:{
    children: React.ReactNode
}) => {
  return (
    <div>
        <DashboardHeader />
        <div className="container mx-auto py-6">
            {
                children
            }
        </div>
    </div>
  )
}

export default DashboardLayout