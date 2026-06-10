import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { cx } from "../lib/cx";

export const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List className={cx("sc-nav-menu__list", className)} ref={ref} {...props} />
));

NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

export const NavigationMenuItem = NavigationMenuPrimitive.Item;
export const NavigationMenuLink = NavigationMenuPrimitive.Link;

export const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ children, className, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    className={cx("sc-nav-menu__trigger", className)}
    ref={ref}
    {...props}
  >
    {children}
    <ChevronDown aria-hidden="true" className="sc-nav-menu__trigger-icon" size={14} strokeWidth={1.8} />
  </NavigationMenuPrimitive.Trigger>
));

NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

export const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content className={cx("sc-nav-menu__content", className)} ref={ref} {...props} />
));

NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

export const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    className={cx("sc-nav-menu__indicator", className)}
    ref={ref}
    {...props}
  >
    <span className="sc-nav-menu__indicator-arrow" />
  </NavigationMenuPrimitive.Indicator>
));

NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className="sc-nav-menu__viewport-wrap">
    <NavigationMenuPrimitive.Viewport
      className={cx("sc-nav-menu__viewport", className)}
      ref={ref}
      {...props}
    />
  </div>
));

NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuRoot = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ children, className, ...props }, ref) => (
  <NavigationMenuPrimitive.Root className={cx("sc-nav-menu", className)} ref={ref} {...props}>
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));

NavigationMenuRoot.displayName = NavigationMenuPrimitive.Root.displayName;

export const NavigationMenu = Object.assign(NavigationMenuRoot, {
  Content: NavigationMenuContent,
  Indicator: NavigationMenuIndicator,
  Item: NavigationMenuItem,
  Link: NavigationMenuLink,
  List: NavigationMenuList,
  Trigger: NavigationMenuTrigger,
  Viewport: NavigationMenuViewport
});
