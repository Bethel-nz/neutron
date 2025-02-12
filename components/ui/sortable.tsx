/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import {
  DndContext,
  type DndContextProps,
  type DragEndEvent,
  DragOverlay,
  type DraggableSyntheticListeners,
  type DropAnimation,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  closestCenter,
  closestCorners,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  type SortableContextProps,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slot, type SlotProps } from "@radix-ui/react-slot";
import * as React from "react";
import {useMemo, useCallback, useState, useId, createContext, useContext, forwardRef, ReactNode,  ComponentPropsWithoutRef, useLayoutEffect, HTMLAttributes, CSSProperties, Ref} from 'react'

import { composeEventHandlers, useComposedRefs } from "@/lib/composition";
import { cn } from "@/lib/utils";
import * as ReactDOM from "react-dom";

const orientationConfig = {
  vertical: {
    modifiers: [restrictToVerticalAxis, restrictToParentElement],
    strategy: verticalListSortingStrategy,
    collisionDetection: closestCenter,
  },
  horizontal: {
    modifiers: [restrictToHorizontalAxis, restrictToParentElement],
    strategy: horizontalListSortingStrategy,
    collisionDetection: closestCenter,
  },
  mixed: {
    modifiers: [restrictToParentElement],
    strategy: undefined,
    collisionDetection: closestCorners,
  },
};

const ROOT_NAME = "Sortable";
const CONTENT_NAME = "SortableContent";
const ITEM_NAME = "SortableItem";
const ITEM_HANDLE_NAME = "SortableItemHandle";
const OVERLAY_NAME = "SortableOverlay";

const SORTABLE_ERROR = {
  root: `${ROOT_NAME} components must be within ${ROOT_NAME}`,
  content: `${CONTENT_NAME} must be within ${ROOT_NAME}`,
  item: `${ITEM_NAME} must be within ${CONTENT_NAME}`,
  itemHandle: `${ITEM_HANDLE_NAME} must be within ${ITEM_NAME}`,
  overlay: `${OVERLAY_NAME} must be within ${ROOT_NAME}`,
} as const;

interface SortableRootContextValue<T> {
  id: string;
  items: T[];
  modifiers: DndContextProps["modifiers"];
  strategy: SortableContextProps["strategy"];
  activeId: UniqueIdentifier | null;
  setActiveId: (id: UniqueIdentifier | null) => void;
  getItemValue: (item: T) => UniqueIdentifier;
  flatCursor: boolean;
}

const SortableRootContext =
  createContext<SortableRootContextValue<unknown> | null>(null);
SortableRootContext.displayName = ROOT_NAME;

function useSortableContext(name: keyof typeof SORTABLE_ERROR) {
  const context = useContext(SortableRootContext);
  if (!context) {
    throw new Error(SORTABLE_ERROR[name]);
  }
  return context;
}

interface GetItemValue<T> {
  /**
   * Callback that returns a unique identifier for each sortable item. Required for array of objects.
   * @example getItemValue={(item) => item.id}
   */
  getItemValue: (item: T) => UniqueIdentifier;
}

type SortableProps<T> = DndContextProps & {
  value: T[];
  onValueChange?: (items: T[]) => void;
  onMove?: (event: DragEndEvent) => void;
  strategy?: SortableContextProps["strategy"];
  orientation?: "vertical" | "horizontal" | "mixed";
  flatCursor?: boolean;
} & (T extends object ? GetItemValue<T> : Partial<GetItemValue<T>>);

function Sortable<T>(props: SortableProps<T>) {
  const {
    id = useId(),
    value,
    onValueChange,
    collisionDetection,
    modifiers,
    strategy,
    sensors: sensorsProp,
    onMove,
    orientation = "vertical",
    flatCursor = false,
    getItemValue: getItemValueProp,
    ...sortableProps
  } = props;
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const config = useMemo(
    () => orientationConfig[orientation],
    [orientation],
  );
  const getItemValue = useCallback(
    (item: T): UniqueIdentifier => {
      if (typeof item === "object" && !getItemValueProp) {
        throw new Error(
          "getItemValue is required when using array of objects.",
        );
      }
      return getItemValueProp
        ? getItemValueProp(item)
        : (item as UniqueIdentifier);
    },
    [getItemValueProp],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over?.id) {
        const activeIndex = value.findIndex(
          (item) => getItemValue(item) === active.id,
        );
        const overIndex = value.findIndex(
          (item) => getItemValue(item) === over.id,
        );

        if (onMove) {
          onMove(event);
        } else {
          onValueChange?.(arrayMove(value, activeIndex, overIndex));
        }
      }
      setActiveId(null);
    },
    [value, onValueChange, onMove, getItemValue],
  );

  const contextValue = useMemo(
    () => ({
      id,
      items: value,
      modifiers: modifiers ?? config.modifiers,
      strategy: strategy ?? config.strategy,
      activeId,
      setActiveId,
      getItemValue,
      flatCursor,
    }),
    [
      id,
      value,
      modifiers,
      strategy,
      config.modifiers,
      config.strategy,
      activeId,
      getItemValue,
      flatCursor,
    ],
  );

  return (
    <SortableRootContext.Provider
      value={contextValue as SortableRootContextValue<unknown>}
    >
      <DndContext
        id={id}
        modifiers={modifiers ?? config.modifiers}
        sensors={sensorsProp ?? sensors}
        collisionDetection={collisionDetection ?? config.collisionDetection}
        onDragStart={composeEventHandlers(
          sortableProps.onDragStart,
          ({ active }: { active: { id: UniqueIdentifier } }) => setActiveId(active.id),
        )}
        onDragEnd={composeEventHandlers(sortableProps.onDragEnd, onDragEnd)}
        onDragCancel={composeEventHandlers(sortableProps.onDragCancel, () =>
          setActiveId(null),
        )}
        accessibility={{
          ...props.accessibility,
          announcements: {
            onDragStart({ active }) {
              return `Picked up sortable item ${active.id}. Use arrow keys to move, space to drop.`;
            },
            onDragOver({ active, over }) {
              if (over) {
                return `Sortable item ${active.id} was moved over position ${over.id}.`;
              }
              return `Sortable item ${active.id} is no longer over a droppable area.`;
            },
            onDragEnd({ active, over }) {
              if (over) {
                return `Sortable item ${active.id} was dropped over position ${over.id}.`;
              }
              return `Sortable item ${active.id} was dropped.`;
            },
            onDragCancel({ active }) {
              return `Sorting was cancelled. Sortable item ${active.id} was dropped.`;
            },
            onDragMove({ active, over }) {
              if (over) {
                return `Sortable item ${active.id} was moved over position ${over.id}.`;
              }
              return `Sortable item ${active.id} is no longer over a droppable area.`;
            },
            ...props.accessibility?.announcements,
          },
        }}
        {...sortableProps}
      />
    </SortableRootContext.Provider>
  );
}

const SortableContentContext = createContext<boolean>(false);
SortableContentContext.displayName = CONTENT_NAME;

interface SortableContentProps extends SlotProps {
  strategy?: SortableContextProps["strategy"];
  children: ReactNode;
  asChild?: boolean;
}

const SortableContent = forwardRef<HTMLDivElement, SortableContentProps>(
  (props, forwardedRef) => {
    const { strategy: strategyProp, asChild, ...contentProps } = props;
    const context = useSortableContext("content");

    const items = useMemo(() => {
      return context.items.map((item) => context.getItemValue(item));
    }, [ context]);

    const ContentSlot = asChild ? Slot : "div";

    return (
      <SortableContentContext.Provider value={true}>
        <SortableContext
          items={items}
          strategy={strategyProp ?? context.strategy}
        >
          <ContentSlot {...contentProps} ref={forwardedRef} />
        </SortableContext>
      </SortableContentContext.Provider>
    );
  },
);
SortableContent.displayName = CONTENT_NAME;

const SortableOverlayContext = createContext(false);
SortableOverlayContext.displayName = OVERLAY_NAME;

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

interface SortableOverlayProps
  extends Omit<ComponentPropsWithoutRef<typeof DragOverlay>, "children"> {
  container?: HTMLElement | DocumentFragment | null;
  children?:
    | ((params: { value: UniqueIdentifier }) => ReactNode)
    | ReactNode;
}

function SortableOverlay(props: SortableOverlayProps) {
  const {
    container: containerProp,
    dropAnimation: dropAnimationProp,
    children,
    ...overlayProps
  } = props;
  const context = useSortableContext("overlay");

  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);

  const container =
    containerProp ?? (mounted ? globalThis.document?.body : null);

  if (!container) return null;

  return ReactDOM.createPortal(
    <DragOverlay
      modifiers={context.modifiers}
      dropAnimation={dropAnimationProp ?? dropAnimation}
      className={cn(!context.flatCursor && "cursor-grabbing")}
      {...overlayProps}
    >
      <SortableOverlayContext.Provider value={true}>
        {context.activeId ? (
          typeof children === "function" ? (
            children({ value: context.activeId })
          ) : (
            <SortableItem value={context.activeId} asChild>
              {children}
            </SortableItem>
          )
        ) : null}
      </SortableOverlayContext.Provider>
    </DragOverlay>,
    container,
  );
}

interface SortableItemContextValue {
  id: string;
  attributes: HTMLAttributes<HTMLElement>;
  listeners: DraggableSyntheticListeners | undefined;
  setActivatorNodeRef: (node: HTMLElement | null) => void;
  isDragging?: boolean;
  disabled?: boolean;
}

const SortableItemContext = createContext<SortableItemContextValue>({
  id: "",
  attributes: {},
  listeners: undefined,
  setActivatorNodeRef: () => {},
  isDragging: false,
});
SortableItemContext.displayName = ITEM_NAME;

interface SortableItemProps extends SlotProps {
  value: UniqueIdentifier;
  asHandle?: boolean;
  asChild?: boolean;
  disabled?: boolean;
}

const SortableItem = forwardRef<HTMLDivElement, SortableItemProps>(
  (props, forwardedRef) => {
    const {
      value,
      style,
      asHandle,
      asChild,
      disabled,
      className,
      ...itemProps
    } = props;

    const inSortableContent = useContext(SortableContentContext);
    const inSortableOverlay = useContext(SortableOverlayContext);

    if (!inSortableContent && !inSortableOverlay) {
      throw new Error(SORTABLE_ERROR.item);
    }

    if (value === "") {
      throw new Error(`${ITEM_NAME} value cannot be an empty string.`);
    }

    const context = useSortableContext("item");
    const id = useId();
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: value, disabled });

    const composedRef = useComposedRefs(forwardedRef, (node: HTMLElement | null) => {
      if (disabled) return;
      setNodeRef(node);
      if (asHandle) setActivatorNodeRef(node);
    });

    const composedStyle = useMemo<CSSProperties>(() => {
      return {
        transform: CSS.Translate.toString(transform),
        transition,
        ...style,
      };
    }, [transform, transition, style]);

    const itemContext = useMemo<SortableItemContextValue>(
      () => ({
        id,
        attributes,
        listeners,
        setActivatorNodeRef,
        isDragging,
        disabled,
      }),
      [id, attributes, listeners, setActivatorNodeRef, isDragging, disabled],
    );

    const ItemSlot = asChild ? Slot : "div";

    return (
      <SortableItemContext.Provider value={itemContext}>
        <ItemSlot
          id={id}
          data-dragging={isDragging ? "" : undefined}
          {...itemProps}
          {...(asHandle ? attributes : {})}
          {...(asHandle ? listeners : {})}
          tabIndex={disabled ? undefined : 0}
          ref={composedRef as Ref<HTMLDivElement>}
          style={composedStyle}
          className={cn(
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
            {
              "touch-none select-none": asHandle,
              "cursor-default": context.flatCursor,
              "data-[dragging]:cursor-grabbing": !context.flatCursor,
              "cursor-grab": !isDragging && asHandle && !context.flatCursor,
              "opacity-50": isDragging,
              "pointer-events-none opacity-50": disabled,
            },
            className,
          )}
        />
      </SortableItemContext.Provider>
    );
  },
);
SortableItem.displayName = ITEM_NAME;

interface SortableItemHandleProps
  extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
}

const SortableItemHandle = forwardRef<
  HTMLButtonElement,
  SortableItemHandleProps
>((props, forwardedRef) => {
  const { asChild, disabled, className, ...dragHandleProps } = props;
  const itemContext = React.useContext(SortableItemContext);
  if (!itemContext) {
    throw new Error(SORTABLE_ERROR.itemHandle);
  }
  const context = useSortableContext("itemHandle");

  const isDisabled = disabled ?? itemContext.disabled;

  const composedRef = useComposedRefs(forwardedRef, (node: HTMLElement | null) => {
    if (!isDisabled) return;
    itemContext.setActivatorNodeRef(node);
  });

  const HandleSlot = asChild ? Slot : "button";

  return (
    <HandleSlot
      aria-controls={itemContext.id}
      data-dragging={itemContext.isDragging ? "" : undefined}
      {...dragHandleProps}
      {...itemContext.attributes}
      {...itemContext.listeners}
      ref={composedRef as Ref<HTMLButtonElement>}
      className={cn(
        "select-none disabled:pointer-events-none disabled:opacity-50",
        context.flatCursor
          ? "cursor-default"
          : "cursor-grab data-[dragging]:cursor-grabbing",
        className,
      )}
      disabled={isDisabled}
    />
  );
});
SortableItemHandle.displayName = ITEM_HANDLE_NAME;

const Root = Sortable;
const Content = SortableContent;
const Item = SortableItem;
const ItemHandle = SortableItemHandle;
const Overlay = SortableOverlay;

export {
  Root,
  Content,
  Item,
  ItemHandle,
  Overlay,
  //
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
};
