import { useEffect, useRef } from "react";
import "../styles/ScrollContainer.css";

type ScrollContainerProps = {
  children: React.ReactNode;
  reachedEnd: boolean;
  onLoadMore: (arg: boolean) => void;
};

export const ScrollContainer = ({
  children,
  reachedEnd,
  onLoadMore,
}: ScrollContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = (reachedEnd: boolean) => {
    if (ref.current) {
      const windowHeight = window.innerHeight;
      const bottomOfWindow = windowHeight + window.scrollY;
      const bottomOfContent = ref.current.offsetHeight;

      const isReachingBottom = bottomOfWindow >= bottomOfContent - windowHeight;

      if (!reachedEnd) {
        if (isReachingBottom) {
          onLoadMore(true);
        } else {
          onLoadMore(false);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", () => handleScroll(reachedEnd));
  }, []);

  return (
    <div ref={ref} className="ScrollContainer">
      {children}
    </div>
  );
};
