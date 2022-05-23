import { useEffect, useRef } from "react";
import "../styles/ScrollContainer.css";

type ScrollContainerProps = {
  children: React.ReactNode;
  onLoadMore: (arg: boolean) => void;
};

export const ScrollContainer = ({
  children,
  onLoadMore,
}: ScrollContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (ref.current) {
      const windowHeight = window.innerHeight;
      const bottomOfWindow = windowHeight + window.scrollY;
      const bottomOfContent = ref.current.offsetHeight;

      const isReachingBottom = bottomOfWindow >= bottomOfContent - windowHeight;

      if (isReachingBottom) {
        onLoadMore(true);
      } else {
        onLoadMore(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={ref} className="ScrollContainer">
      {children}
    </div>
  );
};
