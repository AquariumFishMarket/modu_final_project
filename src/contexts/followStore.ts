import { create } from "zustand";

interface FollowUpdatePayload {
  accountname: string;

  isfollow: boolean;

  followerCountDiff?: number;
}

interface FollowState {
  lastUpdate: FollowUpdatePayload | null;
  updateFollow: (payload: FollowUpdatePayload) => void;
  clearUpdate: () => void;
}

export const useFollowStore = create<FollowState>((set) => ({
  lastUpdate: null,
  updateFollow: (payload) => set({ lastUpdate: payload }),
  clearUpdate: () => set({ lastUpdate: null }),
}));
