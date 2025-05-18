"use client"

import { useState } from "react"

export type ToastType = "default" | "destructive" | "success"

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  dismissToast: (id: string) => void
}

// Simple counter for generating unique IDs
let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = `toast-${toastCount++}`
    const newToast = { ...toast, id }
    
    setToasts((prev) => [...prev, newToast])
    
    // Auto dismiss after duration
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        dismissToast(id)
      }, toast.duration || 5000)
    }
    
    return id
  }
  
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }
  
  const toast = (props: Omit<Toast, "id">) => {
    return addToast(props)
  }
  
  return {
    toasts,
    toast,
    dismiss: dismissToast,
  }
}
