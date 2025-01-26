import { Bookmark } from "@/types"

function generateMockBookmarks(count: number): Bookmark[] {
	const types: Bookmark['type'][] = ['webpage', 'file', 'article']
	const domains = [
		'example.com',
		'test.org',
		'demo.dev',
		'sample.net',
		'prototype.app'
	]
	const fileTypes = ['pdf', 'docx', 'xlsx', 'pptx', 'md', 'txt']
	const projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta']
	const categories = ['Documentation', 'Research', 'Design', 'Meeting Notes', 'Technical Specs']

	const startDate = new Date('2023-01-01')
	const bookmarks: Bookmark[] = []

	for (let i = 0; i < count; i++) {
		const type = types[Math.floor(Math.random() * types.length)]
		const date = new Date(startDate)
		date.setHours(date.getHours() + i * 2) // Increment time by 2 hours for each item

		const baseBookmark = {
			id: String(i + 1),
			userId: 'user1',
			groupId: 'group1',
			isFavorite: Math.random() > 0.9, // 10% chance of being favorite
			createdAt: date.toISOString() as unknown as Date,
			updatedAt: date.toISOString() as unknown as Date,
			type,
		}

		switch (type) {
			case 'webpage':
				bookmarks.push({
					...baseBookmark,
					content: `${categories[Math.floor(Math.random() * categories.length)]} - ${projects[Math.floor(Math.random() * projects.length)]
						}`,
					url: `https://${domains[Math.floor(Math.random() * domains.length)]}/path/${Math.random().toString(36).substring(7)}`,
					description: '',
				})
				break

			case 'article':
				bookmarks.push({
					...baseBookmark,
					content: `${projects[Math.floor(Math.random() * projects.length)]} ${fileTypes[Math.floor(Math.random() * fileTypes.length)]
						}`.toUpperCase(),
					url: `file:///documents/${projects[Math.floor(Math.random() * projects.length)].replace(' ', '_')}_v${Math.floor(Math.random() * 5) + 1}.${fileTypes[Math.floor(Math.random() * fileTypes.length)]
						}`,
					description: 'This is a description',
				})
				break

			case 'file':
				bookmarks.push({
					...baseBookmark,
					content: `${projects[Math.floor(Math.random() * projects.length)]} ${['Design', 'Prototype', 'Wireframe', 'Mockup'][Math.floor(Math.random() * 4)]
						}`,
					url: `https://figma.com/file/${Math.random().toString(36).substring(2, 15)}`,
					description: 'This is a description',
				})
				break
		}
	}

	return bookmarks
}

// Replace your mockBookmarks with:
export const mockBookmarks: Bookmark[] = generateMockBookmarks(5)