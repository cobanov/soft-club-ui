import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "../lib/cx";

interface CarouselContextValue {
  count: number;
  index: number;
  loop: boolean;
  next: () => void;
  prev: () => void;
  scrollTo: (index: number) => void;
  setCount: (count: number) => void;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

const useCarousel = () => {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("Carousel components must be used within <Carousel>.");
  return context;
};

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultIndex?: number;
  loop?: boolean;
  onIndexChange?: (index: number) => void;
}

/**
 * A lightweight slide carousel. The track translates by whole viewports, and
 * the active index is shared by context so controls and dots stay in sync.
 */
const CarouselRoot = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ children, className, defaultIndex = 0, loop = false, onIndexChange, ...props }, ref) => {
    const [index, setIndex] = React.useState(defaultIndex);
    const [count, setCount] = React.useState(0);

    const scrollTo = React.useCallback(
      (next: number) => {
        setIndex((current) => {
          const total = count || 1;
          let target = next;
          if (loop) target = (next + total) % total;
          else target = Math.max(0, Math.min(next, total - 1));
          if (target !== current) onIndexChange?.(target);
          return target;
        });
      },
      [count, loop, onIndexChange]
    );

    const next = React.useCallback(() => scrollTo(index + 1), [index, scrollTo]);
    const prev = React.useCallback(() => scrollTo(index - 1), [index, scrollTo]);

    const context = React.useMemo(
      () => ({ count, index, loop, next, prev, scrollTo, setCount }),
      [count, index, loop, next, prev, scrollTo]
    );

    return (
      <CarouselContext.Provider value={context}>
        <div
          aria-roledescription="carousel"
          className={cx("sc-carousel", className)}
          ref={ref}
          role="region"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);

CarouselRoot.displayName = "Carousel";

export const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    const { index, setCount } = useCarousel();
    const total = React.Children.count(children);
    React.useEffect(() => setCount(total), [setCount, total]);
    return (
      <div className={cx("sc-carousel__viewport", className)} ref={ref} {...props}>
        <div className="sc-carousel__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {children}
        </div>
      </div>
    );
  }
);

CarouselContent.displayName = "CarouselContent";

export const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      aria-roledescription="slide"
      className={cx("sc-carousel__slide", className)}
      ref={ref}
      role="group"
      {...props}
    />
  )
);

CarouselItem.displayName = "CarouselItem";

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { index, loop, prev } = useCarousel();
  return (
    <button
      aria-label="Previous slide"
      className={cx("sc-carousel__arrow sc-carousel__arrow--prev", className)}
      disabled={!loop && index === 0}
      onClick={prev}
      ref={ref}
      type="button"
      {...props}
    >
      <ChevronLeft size={16} strokeWidth={1.8} />
    </button>
  );
});

CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { count, index, loop, next } = useCarousel();
  return (
    <button
      aria-label="Next slide"
      className={cx("sc-carousel__arrow sc-carousel__arrow--next", className)}
      disabled={!loop && index >= count - 1}
      onClick={next}
      ref={ref}
      type="button"
      {...props}
    >
      <ChevronRight size={16} strokeWidth={1.8} />
    </button>
  );
});

CarouselNext.displayName = "CarouselNext";

export const CarouselDots = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { count, index, scrollTo } = useCarousel();
    return (
      <div className={cx("sc-carousel__dots", className)} ref={ref} {...props}>
        {Array.from({ length: count }, (_, dot) => (
          <button
            aria-label={`Go to slide ${dot + 1}`}
            className={cx("sc-carousel__dot", dot === index && "sc-carousel__dot--active")}
            key={dot}
            onClick={() => scrollTo(dot)}
            type="button"
          />
        ))}
      </div>
    );
  }
);

CarouselDots.displayName = "CarouselDots";

export const Carousel = Object.assign(CarouselRoot, {
  Content: CarouselContent,
  Dots: CarouselDots,
  Item: CarouselItem,
  Next: CarouselNext,
  Previous: CarouselPrevious
});
