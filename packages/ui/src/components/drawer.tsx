import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cx } from "../lib/cx";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;
export const DrawerPortal = DialogPrimitive.Portal;

export const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay className={cx("sc-drawer-overlay", className)} ref={ref} {...props} />
));

DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

/** A bottom drawer with a grab handle. */
export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ children, className, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitive.Content className={cx("sc-drawer-content", className)} ref={ref} {...props}>
      <span aria-hidden="true" className="sc-drawer-handle" />
      {children}
    </DialogPrimitive.Content>
  </DrawerPortal>
));

DrawerContent.displayName = DialogPrimitive.Content.displayName;

export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("sc-drawer-header", className)} {...props} />
);

DrawerHeader.displayName = "DrawerHeader";

export const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("sc-drawer-footer", className)} {...props} />
);

DrawerFooter.displayName = "DrawerFooter";

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title className={cx("sc-drawer-title", className)} ref={ref} {...props} />
));

DrawerTitle.displayName = DialogPrimitive.Title.displayName;

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    className={cx("sc-drawer-description", className)}
    ref={ref}
    {...props}
  />
));

DrawerDescription.displayName = DialogPrimitive.Description.displayName;
