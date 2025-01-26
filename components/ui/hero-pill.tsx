import { motion } from "framer-motion"
// import { cn } from "@/lib/utils"

interface HeroPillProps {
  href: string
  label: string
  announcement?: string
  isExternal?: boolean
}

export function HeroPill({ 
  href, 
  label, 
  announcement = "✨ New",
  isExternal = false,
}: HeroPillProps) {
  return (
    <motion.a
      href={href}
      target={isExternal ? "_blank" : undefined}
      className="inline-flex items-center gap-2 rounded-full bg-accent/[0.08] border-2 border-gray-300/20 px-3 py-1 text-sm text-zinc-800 hover:bg-accent/[0.12] transition-colors"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <span className="text-xs border-2 border-gray-400/20 px-2 py-0.5 rounded-full">
        {announcement}
      </span>
      <span className="font-sm">
        {label}
      </span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-accent"
      >
        <path
          d="M8.78141 5.33312L5.20541 1.75712L6.14808 0.814453L11.3334 5.99979L6.14808 11.1851L5.20541 10.2425L8.78141 6.66645H0.666748V5.33312H8.78141Z"
          fill="currentColor"
        />
      </svg>
    </motion.a>
  )
}