import { load } from 'cheerio'
import type { CheerioAPI } from 'cheerio'

interface ScrapedData {
	title: string
	description: string | null
	favicon: string | null
	type: 'webpage' | 'file' | 'article'
}

const agents = [
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
]

const agent = agents[Math.floor(Math.random() * agents.length)]

function isValidUrl(url: string): boolean {
	try {
		const parsedUrl = new URL(url)
		return ['http:', 'https:'].includes(parsedUrl.protocol)
	} catch {
		return false
	}
}

function getFaviconUrl($: CheerioAPI, baseUrl: string): string | null {
	// Check for favicon in different link tags
	const selectors = [
		'link[rel="icon"]',
		'link[rel="shortcut icon"]',
		'link[rel="apple-touch-icon"]',
		'link[rel="apple-touch-icon-precomposed"]'
	]

	for (const selector of selectors) {
		const href = $(selector).attr('href')
		if (href) {
			// Handle relative URLs
			try {
				return new URL(href, baseUrl).href
			} catch {
				return null
			}
		}
	}

	// Fallback to default /favicon.ico
	try {
		const url = new URL('/favicon.ico', baseUrl)
		return url.href
	} catch {
		return null
	}
}

function getMetadata($: CheerioAPI, selectors: string[]): string {
	for (const selector of selectors) {
		const element = $(selector)
		const content = element.attr('content') || element.text()
		if (content) return content.trim()
	}
	return ''
}

export async function scrapeUrl(url: string): Promise<ScrapedData | null> {
	if (!isValidUrl(url)) {
		return null
	}

	try {
		const response = await fetch(url, {
			headers: {
				"user-agent": agent
			}
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch URL: ${response.statusText}`)
		}

		const html = await response.text()
		const $ = load(html)

		const title = getMetadata($, [
			'meta[property="og:title"]',
			'meta[name="twitter:title"]',
			'title',
			'h1'
		])

		const description = getMetadata($, [
			'meta[property="og:description"]',
			'meta[name="twitter:description"]',
			'meta[name="description"]'
		])

		const favicon = getFaviconUrl($, url)

		return {
			title: title || url,
			description: description || null,
			favicon,
			type: 'webpage'
		}
	} catch (error) {
		console.error('Error scraping URL:', error)
		return null
	}
}

export async function processInput(input: string): Promise<ScrapedData | null> {
	if (isValidUrl(input)) {
		return await scrapeUrl(input)
	}
	return null
}
