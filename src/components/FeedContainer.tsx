import { Box, Switch, FormLabel, Typography, FormControl } from "@mui/material";
import { FieldValue } from "firebase/firestore";
import { SignOutButton } from "./SignOutButton";
import { useParams } from "react-router-dom";
import { UserProfile } from "./UserProfile";
import { SortMenu } from "./SortMenu";
import { useState } from "react";
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
  onFilterPressed: (nsfwFilter: boolean) => void;
  orderBy: "createdAt" | "heartCount";
  uid: string | undefined;
  loadingPosts: boolean;
};

export const FeedContainer = (feedProps: FeedContainerProps) => {
  const { filterKind, filter } = useParams<{
    filterKind: "username" | "country" | "genre";
    filter: string;
  }>();
  const [nsfwFilter, setNsfwFilter] = useState(true);
  const {
    username,
    reachedEnd,
    onSortPressed,
    onFilterPressed,
    orderBy,
    loadingPosts,
  } = feedProps;
  const filteredPosts =
    filterKind && feedProps.posts.filter((post) => post[filterKind] === filter);
  const posts = filteredPosts ?? feedProps.posts;

  return (
    <>
      {username === filter && username && (
        <div className="FeedContainer__userProfile">
          <UserProfile username={username} direction="column" />
          <SignOutButton username={username} />
        </div>
      )}
      <div className="FeedContainer">
        <div className="FeedContainer__feedHeader">
          <FormControl>
            <FormLabel style={{ color: "var(--ui)", fontFamily: "monospace" }}>
              NSFW Filter
            </FormLabel>
            <Box className="FeedContainer__feedHeaderToggle">
              <Switch
                onClick={() => {
                  setNsfwFilter(!nsfwFilter);
                  onFilterPressed(!nsfwFilter);
                }}
                checked={nsfwFilter}
              />
            </Box>
          </FormControl>
          <FormControl>
            <FormLabel
              style={{
                textAlign: "right",
                color: "var(--ui)",
                fontFamily: "monospace",
              }}
            >
              Sort By
            </FormLabel>
            <Box className="FeedContainer__feedHeaderRight">
              <Typography className="FeedContainer__orderBy">
                {orderBy === "createdAt" ? "Latest" : "Most popular"}
              </Typography>
              <SortMenu onSortPressed={onSortPressed} />
            </Box>
          </FormControl>
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
