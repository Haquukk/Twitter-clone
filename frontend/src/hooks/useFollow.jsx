import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: followUser, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(
          `/api/users/follow/${userId}`,
          {
            method: "POST",
          }
        );

        const data = res.json();
        if (!res.ok)
          throw new Error(
            data.error || "Something went wrong"
          );
      } catch (err) {
        throw new Error(err.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suggestedUsers"],
      });
			queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
  });

  return { followUser, isPending };
};

export default useFollow;
