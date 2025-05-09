'use client'

import { getMaterials } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

const MaterialList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['material-list'],
    queryFn: getMaterials,
  });

  if (isLoading) return <p>Loading...</p>;

  console.log('material list', data)

  return (
    <div>MaterialList</div>
  )
}

export default MaterialList