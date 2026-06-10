import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cx } from "../lib/cx";
import { Button, type ButtonProps } from "./button";

export const AlertDialog = DialogPrimitive.Root;
export const AlertDialogTrigger = DialogPrimitive.Trigger;
export const AlertDialogPortal = DialogPrimitive.Portal;

export const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cx("sc-alert-dialog-overlay", className)}
    ref={ref}
    {...props}
  />
));

AlertDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/** A confirmation dialog: role=alertdialog, and outside clicks do not dismiss. */
export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <DialogPrimitive.Content
      className={cx("sc-alert-dialog-content", className)}
      onInteractOutside={(event) => event.preventDefault()}
      ref={ref}
      role="alertdialog"
      {...props}
    />
  </AlertDialogPortal>
));

AlertDialogContent.displayName = DialogPrimitive.Content.displayName;

export const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("sc-alert-dialog-header", className)} {...props} />
);

AlertDialogHeader.displayName = "AlertDialogHeader";

export const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("sc-alert-dialog-footer", className)} {...props} />
);

AlertDialogFooter.displayName = "AlertDialogFooter";

export const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title className={cx("sc-alert-dialog-title", className)} ref={ref} {...props} />
));

AlertDialogTitle.displayName = DialogPrimitive.Title.displayName;

export const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    className={cx("sc-alert-dialog-description", className)}
    ref={ref}
    {...props}
  />
));

AlertDialogDescription.displayName = DialogPrimitive.Description.displayName;

/** Confirms the action and closes the dialog. */
export const AlertDialogAction = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <DialogPrimitive.Close asChild>
      <Button ref={ref} type="button" {...props} />
    </DialogPrimitive.Close>
  )
);

AlertDialogAction.displayName = "AlertDialogAction";

/** Dismisses the dialog without acting. */
export const AlertDialogCancel = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "outline", ...props }, ref) => (
    <DialogPrimitive.Close asChild>
      <Button ref={ref} type="button" variant={variant} {...props} />
    </DialogPrimitive.Close>
  )
);

AlertDialogCancel.displayName = "AlertDialogCancel";
