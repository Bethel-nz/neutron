import { useSession } from "next-auth/react"
import { useCreateBookmark } from "@/lib/query-client"
import { scrapeUrl } from "@/actions/scraper"
import type { Bookmark } from "@/types"
import { useState } from "react"

export function useBookmarkActions(groupId: string | undefined) {
	const session = useSession()
	const createBookmark = useCreateBookmark()
	const [isScrapingUrl, setIsScrapingUrl] = useState(false)

	const addBookmark = async (input: string) => {
		if (!groupId || !session.data?.user) return

		const isUrl = input.startsWith('http://') || input.startsWith('https://') || input.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/i)

		if (isUrl) {
			setIsScrapingUrl(true)
			try {
				const scrapedData = await scrapeUrl(input)
				createBookmark.mutate({
					userId: session.data.user.id as string,
					groupId,
					content: scrapedData?.description || input,
					url: input,
					type: scrapedData?.type || 'webpage'
				})
			} catch (error) {
				console.error('Error adding bookmark:', error)
				// Still create bookmark even if scraping fails
				createBookmark.mutate({
					userId: session.data.user.id as string,
					groupId,
					content: input,
					url: input,
					type: 'webpage'
				})
			} finally {
				setIsScrapingUrl(false)
			}
		} else {
			createBookmark.mutate({
				userId: session.data.user.id as string,
				groupId,
				content: input,
				url: null,
				type: 'article'
			})
		}
	}

	return {
		addBookmark,
		isLoading: createBookmark.isPending || isScrapingUrl
	}
} 