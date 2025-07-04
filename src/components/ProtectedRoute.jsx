import React from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-800 flex items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center justify-center mb-8">
            <Skeleton className="h-8 w-8 rounded mr-3" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}