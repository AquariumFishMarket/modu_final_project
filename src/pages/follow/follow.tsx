// src/pages/follow/Follow.tsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import FollowUserCard from "../../components/common/follow/FollowUserCard";
import type { FollowUser } from "../../types/follow";
import {
  fetchFollowers,
  fetchFollowing,
  toggleFollow,
} from "../../services/followService";
import { FollowListContainer, EmptyState } from "./follow.styled";
import { useFollowStore } from "../../contexts/followStore";

function Follow() {
  const location = useLocation();
  const { accountname } = useParams<{ accountname: string }>();

  const updateFollowStore = useFollowStore((state) => state.updateFollow);

  const [users, setUsers] = useState<FollowUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFollowerPage = location.pathname.endsWith("/follower");

  // 목록 로드
  useEffect(() => {
    if (!accountname) return;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = isFollowerPage
          ? await fetchFollowers(accountname)
          : await fetchFollowing(accountname);
        setUsers(data);
      } catch (err) {
        setError("목록을 불러오는데 실패했습니다.");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [accountname, isFollowerPage]);

  // 팔로우 토글
  const handleFollowToggle = useCallback(
    async (targetAccountname: string) => {
      const target = users.find((u) => u.userId === targetAccountname);
      if (!target) return;

      const prevUsers = [...users];

      setUsers((prev) =>
        prev.map((u) =>
          u.userId === targetAccountname
            ? { ...u, isFollowing: !u.isFollowing }
            : u
        )
      );

      try {
        await toggleFollow(targetAccountname, target.isFollowing);

        updateFollowStore({
          accountname: targetAccountname,
          isfollow: !target.isFollowing,
          followerCountDiff: target.isFollowing ? -1 : 1,
        });
      } catch (err) {
        setUsers(prevUsers);
      }
    },
    [users, updateFollowStore]
  );

  return (
    <FollowListContainer>
      {isLoading && <EmptyState>불러오는 중...</EmptyState>}
      {!isLoading && error && <EmptyState>{error}</EmptyState>}
      {!isLoading && !error && users.length === 0 && (
        <EmptyState>
          {isFollowerPage
            ? "팔로워가 없습니다."
            : "팔로잉한 사용자가 없습니다."}
        </EmptyState>
      )}

      {!isLoading &&
        !error &&
        users.map((user) => (
          <li key={user.userId}>
            <FollowUserCard
              userName={user.userName}
              userId={user.userId}
              userImage={user.userImage}
              userIntro={user.userIntro}
              isFollowing={user.isFollowing}
              onFollowToggle={handleFollowToggle}
            />
          </li>
        ))}
    </FollowListContainer>
  );
}

export default Follow;
