import type { Bookmark } from "@/types"

export function groupBookmarksByDate(bookmarks: Bookmark[]) {
	const groups = bookmarks.reduce((acc, bookmark) => {
		const date = new Date(bookmark.createdAt!).toLocaleDateString()
		if (!acc[date]) {
			acc[date] = []
		}
		acc[date].push(bookmark)
		return acc
	}, {} as Record<string, Bookmark[]>)

	return Object.entries(groups)
} 