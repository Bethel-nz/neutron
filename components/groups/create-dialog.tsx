'use client'

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGroupDialog, groupDialog$ } from "@/store/use-group-dialog"
import { $React } from "@legendapp/state/react-web"
import { Zap, X } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { newGroup } from "@/actions/groups"

import { useActiveGroup } from '@/hooks/use-active-group';
// import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRef } from "react"
import { friendlyWords } from "friendlier-words"
import { cn } from "@/lib/utils"
import { Group } from "@/types"

const randomNames = ["Notes", "Spaces", "Links", "Research", "Ideas", "Projects"]

export function CreateGroupDialog() {
  const { isOpen, close } = useGroupDialog()
  const { data: session } = useSession()
//   const router = useRouter()
  const queryClient = useQueryClient()

  const {  setActiveGroup } = useActiveGroup();
	const placeholderName = useRef(randomNames[Math.floor(Math.random() * randomNames.length)])

  const createGroupMutation = useMutation({
    mutationFn: async () => {
      const name = groupDialog$.name.get()
      const slug = groupDialog$.slug.get().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      return newGroup(name, slug, session?.user?.id as string)
    },
    onSuccess: (newGroup) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      setActiveGroup(newGroup as Group)
    //   router.push(`/bookmarks/${(newGroup as Group).slug}`)
      toast.success('Group created')
      close()
    },
  })

  return (
	  <Dialog open={isOpen} onOpenChange={close} >
      <DialogContent className="sm:max-w-[425px]" hideClose>
		  <DialogHeader className="flex flex-row items-center justify-between">
				<DialogTitle>Create new group</DialogTitle>
				  <DialogClose asChild className="absolute right-1 rounded-full -top-1">
						<Button
							variant="ghost"
							size="icon"
						className={cn(
							"h-8 w-8 p-0",
							"hover:bg-gray-200 transition-colors",
							"focus-visible:ring-1 focus-visible:ring-gray-950"
						)}
						onClick={close}
					>
						<X className="h-4 w-4" />
						<span className="sr-only">Close</span>
					</Button>
				</DialogClose>
			</DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <$React.input
              as={Input}
              id="name"
              $value={groupDialog$.name}
              placeholder={placeholderName.current}
              className="col-span-3 border-2 border-primary/20 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800/40 h-10 w-full"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="slug" className="text-sm font-medium">
              Slug
            </label>
            <div className="flex gap-2">
              <$React.input
                as={Input}
                id="slug"
                $value={groupDialog$.slug}
                placeholder={Math.random() > 0.5 ? placeholderName.current.toLowerCase().replace(/[^a-z0-9]+/g, '-') : friendlyWords(2, '-')}
                className="col-span-3 border-2 border-primary/20 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800/40 h-10 w-full"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => groupDialog$.generateSlug()}
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>
            
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button 
            onClick={() => createGroupMutation.mutate()}
            disabled={createGroupMutation.isPending}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 