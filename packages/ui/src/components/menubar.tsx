import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { ChevronRight } from "lucide-react";
import { cx } from "../lib/cx";

// Wrapped (rather than re-exported) so tsup's .d.ts emit does not need to name
// the Radix scoped-context internal type, which is not portable across packages.
export const MenubarMenu = (
  props: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Menu>
): React.JSX.Element => <MenubarPrimitive.Menu {...props} />;
export const MenubarGroup = MenubarPrimitive.Group;
export const MenubarPortal = MenubarPrimitive.Portal;
export const MenubarSub = MenubarPrimitive.Sub;
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

export const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root className={cx("sc-menubar", className)} ref={ref} {...props} />
));

Menubar.displayName = MenubarPrimitive.Root.displayName;

export const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger className={cx("sc-menubar-trigger", className)} ref={ref} {...props} />
));

MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

export const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ align = "start", alignOffset = -4, className, sideOffset = 6, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      align={align}
      alignOffset={alignOffset}
      className={cx("sc-dropdown-content sc-menu-content", className)}
      ref={ref}
      sideOffset={sideOffset}
      {...props}
    />
  </MenubarPrimitive.Portal>
));

MenubarContent.displayName = MenubarPrimitive.Content.displayName;

export const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Item className={cx("sc-dropdown-item", className)} ref={ref} {...props} />
));

MenubarItem.displayName = MenubarPrimitive.Item.displayName;

export const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Label className={cx("sc-dropdown-label", className)} ref={ref} {...props} />
));

MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

export const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator className={cx("sc-dropdown-separator", className)} ref={ref} {...props} />
));

MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

export const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger>
>(({ children, className, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    className={cx("sc-dropdown-item sc-menu-subtrigger", className)}
    ref={ref}
    {...props}
  >
    {children}
    <ChevronRight aria-hidden="true" className="sc-menu-subtrigger__icon" size={14} strokeWidth={1.8} />
  </MenubarPrimitive.SubTrigger>
));

MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

export const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    className={cx("sc-dropdown-content sc-menu-content", className)}
    ref={ref}
    {...props}
  />
));

MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

export const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cx("sc-menu-shortcut", className)} {...props} />
);

MenubarShortcut.displayName = "MenubarShortcut";
