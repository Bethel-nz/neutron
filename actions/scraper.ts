'use server'

import { processInput } from "@/lib/scraper"

export async function scrapeUrl(url: string) {
	try {
		const data = await processInput(url)
		return data
	} catch (error) {
		console.error('Error scraping URL:', error)
		return null
	}
} 