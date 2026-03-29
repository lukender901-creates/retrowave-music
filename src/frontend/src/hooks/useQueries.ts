import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Track } from "../backend.d";
import { useActor } from "./useActor";

export function useAllTracks() {
  const { actor, isFetching } = useActor();
  return useQuery<Track[]>({
    queryKey: ["tracks", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTracks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFeaturedTracks(max = 4) {
  const { actor, isFetching } = useActor();
  return useQuery<Track[]>({
    queryKey: ["tracks", "featured", max],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedTracks(BigInt(max));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTracksByGenre(genre: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Track[]>({
    queryKey: ["tracks", "genre", genre],
    queryFn: async () => {
      if (!actor) return [];
      if (genre === "ALL") return actor.getAllTracks();
      return actor.getTracksByGenre(genre);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchTracks(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Track[]>({
    queryKey: ["tracks", "search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchTracks(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}

export function useIncrementPlays() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) return;
      return actor.incrementPlayCount(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });
}
