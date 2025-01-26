"use client"

import { signOutAction } from "@/actions/auth"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTransition } from "react"

export function SignOutButton({ className }: { className: string }) {
	const [isPending, startTransition] = useTransition()
	
	return (
		<button
			className={cn(
				"flex w-full items-center gap-2 outline-none hover:bg-gray-200 rounded-md transition-colors",
				"hover:text-foreground rounded-md transition-colors",
				className
			)}
			onClick={() => startTransition(async () => {
				await signOutAction()
			})}
			disabled={isPending}
		>
			<LogOut size={16} className="text-muted-foreground" />
			<span>Log out</span>
		</button>
	)
}	
