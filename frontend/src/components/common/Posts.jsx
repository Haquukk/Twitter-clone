import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CreatePost from "../../pages/home/CreatePost";

const Posts = ({ feedType, username, userId }) => {
  const getPostsEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${username}`;
      case "likes":
        return `/api/posts/likes/${userId}`;
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostsEndPoint();
  const [createPost, setCreatePost] = useState(false);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const isMyprofile = authUser._id === userId;

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, username, userId, refetch]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && posts?.length === 0 && (
        <>
          <p className="text-center my-4">No posts in this tab. Switch 👻</p>
          <button
            className={` bg-primary text-white px-3 py-2 rounded-full mx-auto block mt-4 ${
              createPost ? "hidden" : ""
            }`}
            onClick={() => setCreatePost(true)}
          >
            {!createPost && "Create post"}
          </button>
          {isMyprofile && createPost ? <CreatePost/> : ""}
        </>
      )}
      {!isLoading && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
