"use client"

import * as React from "react"
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 10
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  onClose?: () => void
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        setUndismissed(toastId, false)
      } else {
        state.toasts.forEach((toast) => {
          setUndismissed(toast.id, false)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
      return state
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function setUndismissed(id: string, isOpen: boolean) {
  if (isOpen) return

  const timeoutId = setTimeout(() => {
    handleRemoveToast(id)
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(id, timeoutId)
}

function handleAddToast(toast: Omit<ToasterToast, "id">) {
  const id = genId()

  const dismiss = () => handleDismissToast(id)

  const update = (props: Partial<ToasterToast>) => {
    const timeoutId = toastTimeouts.get(id)
    if (timeoutId) clearTimeout(timeoutId)

    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: {
        ...props,
        id,
      },
    })
  }

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...toast,
      id,
      open: true,
      onClose: () => {
        if (toast.onClose) toast.onClose()
        dismiss()
      },
    },
  })

  return {
    id,
    dismiss,
    update,
  }
}

function handleDismissToast(toastId?: string) {
  dispatch({
    type: actionTypes.DISMISS_TOAST,
    toastId,
  })
}

function handleRemoveToast(toastId?: string) {
  dispatch({
    type: actionTypes.REMOVE_TOAST,
    toastId,
  })
}

type Toast = Omit<ToasterToast, "id">

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast: (props: Toast) => {
      return handleAddToast(props)
    },
    dismiss: (toastId?: string) => handleDismissToast(toastId),
    remove: (toastId?: string) => handleRemoveToast(toastId),
  }
}

export { useToast, type Toast }