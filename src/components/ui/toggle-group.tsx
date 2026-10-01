"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle-variants";

const ToggleGroupContext =
  React.createContext<VariantProps<typeof toggleVariants>>({
    size: "default",
    variant: "default",
  });

type ToggleGroupSharedProps = Omit<
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
> &
  VariantProps<typeof toggleVariants>;

type ToggleGroupSingleProps = ToggleGroupSharedProps & {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type ToggleGroupMultipleProps = ToggleGroupSharedProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(
  (
    {
      className,
      variant,
      size,
      type,
      children,
      value,
      defaultValue,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const content = (
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    );

    if (type === "single") {
      return (
        <ToggleGroupPrimitive.Root
          {...props}
          ref={ref}
          type="single"
          className={cn("flex items-center justify-center gap-1", className)}
          {...(value !== undefined && { value })}
          {...(defaultValue !== undefined && { defaultValue })}
          {...(onValueChange !== undefined && { onValueChange })}
        >
          {content}
        </ToggleGroupPrimitive.Root>
      );
    }

    return (
      <ToggleGroupPrimitive.Root
        {...props}
        ref={ref}
        type="multiple"
        className={cn("flex items-center justify-center gap-1", className)}
        {...(value !== undefined && { value })}
        {...(defaultValue !== undefined && { defaultValue })}
        {...(onValueChange !== undefined && { onValueChange })}
      >
        {content}
      </ToggleGroupPrimitive.Root>
    );
  },
);

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

type ToggleGroupItemProps =
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, children, variant, size, value, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      {...props}
      ref={ref}
      value={value}
      className={cn(
        toggleVariants({
          variant: context.variant ?? variant,
          size: context.size ?? size,
        }),
        className,
      )}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
