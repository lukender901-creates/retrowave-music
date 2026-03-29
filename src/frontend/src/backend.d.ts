import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Track {
    id: bigint;
    title: string;
    duration: string;
    coverEmoji: string;
    tags: Array<string>;
    year: bigint;
    description: string;
    downloadUrl: string;
    likes: bigint;
    genre: string;
    artist: string;
    plays: bigint;
}
export interface backendInterface {
    getAllTracks(): Promise<Array<Track>>;
    getFeaturedTracks(maxTracks: bigint): Promise<Array<Track>>;
    getTrack(id: bigint): Promise<Track>;
    getTracksByGenre(genre: string): Promise<Array<Track>>;
    incrementPlayCount(id: bigint): Promise<void>;
    searchTracks(term: string): Promise<Array<Track>>;
}
