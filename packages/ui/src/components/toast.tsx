import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cx } from "../lib/cx";
import { Button } from "./button";

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    className={cx("sc-toast-viewport", className)}
    ref={ref}
    {...props}
  />
));

ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Root className={cx("sc-toast-root", className)} ref={ref} {...props} />
));

Toast.displayName = ToastPrimitive.Root.displayName;

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    className={cx("sc-toast-title", className)}
    ref={ref}
    {...props}
  />
));

ToastTitle.displayName = ToastPrimitive.Title.displayName;

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    className={cx("sc-toast-description", className)}
    ref={ref}
    {...props}
  />
));

ToastDescription.displayName = ToastPrimitive.Description.displayName;

export const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ children, className, ...props }, ref) => (
  <ToastPrimitive.Action asChild ref={ref} {...props}>
    <Button className={cx("sc-toast-action", className)} size="sm" variant="outline">
      {children}
    </Button>
  </ToastPrimitive.Action>
));

ToastAction.displayName = ToastPrimitive.Action.displayName;

export const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, children, ...props }, ref) => (
  <ToastPrimitive.Close
    aria-label="Close"
    className={cx("sc-toast-close", className)}
    ref={ref}
    {...props}
  >
    {children ?? <X aria-hidden="true" size={14} strokeWidth={1.8} />}
  </ToastPrimitive.Close>
));

ToastClose.displayName = ToastPrimitive.Close.displayName;
