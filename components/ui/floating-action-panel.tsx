"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAutoResizeTextArea } from "@/hooks/use-auto-resize-textarea"

const TRANSITION = {
  type: "spring",
  bounce: 0.1,
  duration: 0.4,
};

interface FloatingActionPanelContextType {
  isOpen: boolean;
  openPanel: (rect: DOMRect, mode: "actions" | "note") => void;
  closePanel: () => void;
  uniqueId: string;
  triggerRect: DOMRect | null;
  title: string;
  setTitle: (title: string) => void;
  note: string;
  setNote: (note: string) => void;
  mode: "actions" | "note";
}

const FloatingActionPanelContext = React.createContext<
  FloatingActionPanelContextType | undefined
>(undefined);

function useFloatingActionPanelLogic() {
  const uniqueId = React.useId();
  const [isOpen, setIsOpen] = React.useState(false);
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);
  const [title, setTitle] = React.useState("");
  const [note, setNote] = React.useState("");
  const [mode, setMode] = React.useState<"actions" | "note">("actions");

  const openPanel = (rect: DOMRect, newMode: "actions" | "note") => {
    setTriggerRect(rect);
    setMode(newMode);
    setIsOpen(true);
  };
  const closePanel = () => {
    setIsOpen(false);
    setNote("");
  };

  return {
    isOpen,
    openPanel,
    closePanel,
    uniqueId,
    triggerRect,
    title,
    setTitle,
    note,
    setNote,
    mode,
  };
}

interface FloatingActionPanelRootProps {
  children: (context: FloatingActionPanelContextType) => React.ReactNode;
  className?: string;
}

export function FloatingActionPanelRoot({
  children,
  className,
}: FloatingActionPanelRootProps) {
  const floatingPanelLogic = useFloatingActionPanelLogic();

  return (
    <FloatingActionPanelContext.Provider value={floatingPanelLogic}>
      <MotionConfig transition={TRANSITION}>
        <div className={cn("relative", className)}>
          {children(floatingPanelLogic)}
        </div>
      </MotionConfig>
    </FloatingActionPanelContext.Provider>
  );
}

interface FloatingActionPanelTriggerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  mode: "actions" | "note";
}

export function FloatingActionPanelTrigger({
  children,
  className,
  title,
  mode,
}: FloatingActionPanelTriggerProps) {
  const { openPanel, uniqueId, setTitle } = React.useContext(FloatingActionPanelContext)!;
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (triggerRef.current) {
      openPanel(triggerRef.current.getBoundingClientRect(), mode);
      setTitle(title || '');
    }
  };

  return (
    <motion.button
      ref={triggerRef}
      layoutId={`floating-panel-trigger-${uniqueId}-${mode}`}
      className={cn(
        "flex items-center text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

interface FloatingActionPanelContentProps {
  children?: React.ReactNode;
  className?: string;
}

export function FloatingActionPanelContent({
  children,
  className,
}: FloatingActionPanelContentProps) {
  const { isOpen, closePanel, uniqueId, triggerRect, title, mode } =
    React.useContext(FloatingActionPanelContext)!;
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        closePanel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closePanel]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closePanel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(4px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-99 bg-black/5"
          />
          <motion.div
            ref={contentRef}
            layoutId={`floating-panel-${uniqueId}-${mode}`}
            className={cn(
              "fixed z-50 min-w-[200px] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg outline-none dark:border-zinc-800 dark:bg-zinc-950",
              className
            )}
            style={{
              left: triggerRect ? triggerRect.left : "50%",
              top: triggerRect ? triggerRect.bottom + 8 : "50%",
              transformOrigin: "top left",
            }}
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
          >
            {
              title && (
            <div className="px-4 py-3 font-medium">{title}</div>)
            }
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface FloatingActionPanelButtonProps extends MotionProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function FloatingActionPanelButton({
  children,
  onClick,
  className,
  disabled,
  ...props
}: FloatingActionPanelButtonProps) {
  return (
    <motion.button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-900 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { backgroundColor: "rgba(0, 0, 0, 0.05)" } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </motion.button>
  );
}

interface FloatingActionPanelFormProps {
  children: React.ReactNode;
  onSubmit?: (note: string) => void;
  className?: string;
}

export function FloatingActionPanelForm({
  children,
  onSubmit,
  className,
}: FloatingActionPanelFormProps) {
  const { note, closePanel } = React.useContext(FloatingActionPanelContext)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(note);
    closePanel();
  };

  return (
    <form
      className={cn("flex h-full flex-col", className)}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}

interface FloatingActionPanelTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  id?: string;
  defaultValue?: string
}

export function FloatingActionPanelTextarea({
  className,
  id,
  defaultValue,
  ...props
}: FloatingActionPanelTextareaProps) {
  const { note, setNote } = React.useContext(FloatingActionPanelContext)!
  const { textAreaRef, adjustHeight } = useAutoResizeTextArea()

  React.useEffect(() => {
    if (defaultValue) {
      setNote(defaultValue)
    }
  }, [defaultValue, setNote])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value)
    adjustHeight()
  }

  return (
    <div className={cn("relative w-full", className)}>
      <textarea
        {...props}
        ref={textAreaRef}
        id={id}
        className={cn(
          "h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-none",
          "focus:ring-2 focus:ring-primary/50 focus:border-primary/30",
          className
        )}
        autoFocus
        value={note}
        onChange={handleChange}
        rows={1}
      />
    </div>
  )
}