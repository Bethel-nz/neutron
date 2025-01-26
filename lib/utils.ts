import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export const detectOnline = async () => {
  const ping = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com")
    return response.ok
  }
  return await ping() ? true : false
}

export const isOnline = await detectOnline()