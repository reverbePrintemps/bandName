import { useEffect, useRef, useState } from "react";
import { PostType } from "./FeedContainer";
import "../styles/ScrollContainer.css";

type ScrollContainerProps = {
  children: React.ReactNode;
  posts: PostType[] | undefined;
  reachedEndOfPosts: boolean;
  onLoadMore: (arg: boolean) => void;
};

export const ScrollContainer = ({
  children,
  posts,
  reachedEndOfPosts,
  onLoadMore,
}: ScrollContainerProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [bottomOfScrollPosition, setBottomOfWindow] = useState(
    windowHeight + window.scrollY
  );
  const [bottomOfContent, setBottomOfContent] = useState<number>();
  const [isReachingBottom, setIsReachingBottom] = useState<boolean>();

  // If is reaching bottom, load more posts
  useEffect(() => {
    if (isReachingBottom && !reachedEndOfPosts) {
      onLoadMore(true);
    } else {
      onLoadMore(false);
    }
  }, [isReachingBottom, reachedEndOfPosts]);

  // If posts are loaded, signal is reaching bottom
  useEffect(() => {
    if (bottomOfContent) {
      setIsReachingBottom(
        bottomOfScrollPosition >= bottomOfContent - windowHeight
      );
    }
  }, [bottomOfContent, bottomOfScrollPosition, windowHeight]);

  // If posts change, set value for bottom of content
  useEffect(() => {
    if (scrollContainerRef.current && posts) {
      setBottomOfContent(scrollContainerRef.current.offsetHeight);
    }
  }, [posts]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setBottomOfWindow(windowHeight + window.scrollY);
    }
  };

  const handleResize = () => {
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
  });

  return (
    <div ref={scrollContainerRef} className="ScrollContainer">
      {children}
    </div>
  );
};
