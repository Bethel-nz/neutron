"use client"
import { useState, useEffect, useRef } from 'react'

export function useIsOnline() {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    )
    const [isActiveTab, setIsActiveTab] = useState(true)
    const pingIntervalRef = useRef<number | null>(null)

    useEffect(() => {
        const checkConnection = async () => {
            if (!navigator.onLine) {
                setIsOnline(false)
                return
            }

            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
                setIsOnline(response.ok)
            } catch {
                setIsOnline(false)
            }
        }

        checkConnection()

        pingIntervalRef.current = window.setInterval(checkConnection, 30000)

        const handleOnline = () => checkConnection()
        const handleOffline = () => setIsOnline(false)
        const handleVisibilityChange = () => {
            const active = !document.hidden
            setIsActiveTab(active)
            if (active) checkConnection()
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            if (pingIntervalRef.current !== null) {
                clearInterval(pingIntervalRef.current)
            }
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    return { isOnline, isActiveTab }
}