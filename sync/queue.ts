export type QueueStatus = 'pending' | 'processing' | 'processed' | 'error'

export interface QueueItem {
	id: string
	url: string
	status: QueueStatus
	error?: string
	timestamp: number
	retryCount: number
	priority: number
}


//Note: 
/**
* Utilizing Hashmaps for a queue system
* why?: hashmaps are best for queueing and searching, well linked lists are best for quieing since ach head and tail reference it would be easier to add and remove items from queue but with a catch, it would be slowier if we have to look for items in queue particularly items waiting to be processed
*/
export class SyncQueue {
	private queue: Map<string, QueueItem>
	private processing: Set<string>
	private maxRetries: number
	private maxConcurrent: number

	constructor(maxRetries = 3, maxConcurrent = 3) {
		this.queue = new Map()
		this.processing = new Set()
		this.maxRetries = maxRetries
		this.maxConcurrent = maxConcurrent
	}

	enqueue(url: string, priority = 0): string {
		const id = crypto.randomUUID()
		const item: QueueItem = {
			id,
			url,
			status: 'pending',
			timestamp: Date.now(),
			retryCount: 0,
			priority
		}
		this.queue.set(id, item)
		return id
	}

	dequeue(): QueueItem | undefined {
		if (this.processing.size >= this.maxConcurrent) return

		// Get items sorted by priority and timestamp
		const items = Array.from(this.queue.values())
			.filter(item => item.status === 'pending')
			.sort((a, b) =>
				b.priority - a.priority || a.timestamp - b.timestamp
			)

		const item = items[0]
		if (item) {
			this.processing.add(item.id)
			item.status = 'processing'
		}
		return item
	}

	updateStatus(id: string, status: QueueStatus, error?: string) {
		const item = this.queue.get(id)
		if (!item) return

		item.status = status
		if (error) item.error = error

		if (status === 'error' && item.retryCount < this.maxRetries) {
			item.retryCount++
			item.status = 'pending'
			item.timestamp = Date.now() // Move to back of queue
		}

		if (status !== 'processing') {
			this.processing.delete(id)
		}

		this.queue.set(id, item)
	}

	getItem(id: string): QueueItem | undefined {
		return this.queue.get(id)
	}

	getPending(): QueueItem[] {
		return Array.from(this.queue.values())
			.filter(item => item.status === 'pending')
	}

	clear() {
		this.queue.clear()
		this.processing.clear()
	}
} 