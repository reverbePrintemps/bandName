import { Box, Typography } from "@mui/material";
import { FieldValue } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { UserProfile } from "./UserProfile";
import { SortMenu } from "./SortMenu";
import { Feed } from "./Feed";

import "../styles/FeedContainer.css";

export type PostType = {
  uid: string;
  slug: string;
  genre: string;
  title: string;
  country: string;
  username: string;
  createdAt: number;
  heartCount: number;
  description: string;
  onSubmit: () => void;
  updatedAt: FieldValue;
  onCancelSubmission: () => void;
};

export enum FeedKind {
  Public,
  Filtered,
}

type FeedContainerProps = {
  posts: PostType[];
  username: string | null | undefined;
  reachedEnd: boolean;
  onSortPressed: (sort: "createdAt" | "heartCount") => void;
  orderBy: "createdAt" | "heartCount";
  uid: string | undefined;
  loadingPosts: boolean;
};

export const FeedContainer = (feedProps: FeedContainerProps) => {
  const { filterKind, filter } = useParams<{
    filterKind: "username" | "country" | "genre";
    filter: string;
  }>();
  const { username, reachedEnd, onSortPressed, orderBy, loadingPosts } =
    feedProps;
  const filteredPosts =
    filterKind && feedProps.posts.filter((post) => post[filterKind] === filter);
  const posts = filteredPosts ?? feedProps.posts;

  return (
    <>
      {username === filter && username && <UserProfile username={username} />}
      <div className="FeedContainer">
        <div className="FeedContainer__feedHeader">
          <Box margin="auto 0">
            <Typography className="FeedContainer__orderBy">
              {orderBy === "createdAt" ? "Latest" : "Most popular"}
            </Typography>
          </Box>
          <SortMenu onSortPressed={onSortPressed} />
        </div>
        {posts.length > 0 ? (
          <>
            <Feed posts={posts} orderBy={orderBy} loadingPosts={loadingPosts} />
            {reachedEnd && (
              <span className="FeedContainer__footerMessage">
                This is the end, my friend.
              </span>
            )}
          </>
        ) : (
          <p className="FeedContainer__emptyFeed">No posts yet. 🙈</p>
        )}
      </div>
    </>
  );
};
