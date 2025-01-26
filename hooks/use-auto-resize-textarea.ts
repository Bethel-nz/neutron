"use client"

import * as React from "react"

export function useAutoResizeTextArea() {
	const textAreaRef = React.useRef<HTMLTextAreaElement>(null)

	const adjustHeight = React.useCallback(() => {
		const textArea = textAreaRef.current
		if (!textArea) return

		// Reset height to allow shrinking
		textArea.style.height = 'auto'

		// Set new height based on scrollHeight
		const newHeight = textArea.scrollHeight
		textArea.style.height = `${newHeight}px`
	}, [])

	React.useEffect(() => {
		const textArea = textAreaRef.current
		if (!textArea) return

		// Initial height adjustment
		adjustHeight()

		// Adjust on window resize
		window.addEventListener('resize', adjustHeight)
		return () => window.removeEventListener('resize', adjustHeight)
	}, [adjustHeight])

	return { textAreaRef, adjustHeight }
}