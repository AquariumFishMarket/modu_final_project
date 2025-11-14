import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHeader } from "../../contexts/HeaderContext";
import FollowUserCard from "../../components/common/follow/FollowUserCard";
import type { FollowUser } from "../../types/follow";
import {
  fetchFollowers,
  fetchFollowing,
  toggleFollow,
} from "../../services/followService";
import { FollowListContainer, EmptyState } from "./follow.styled";

function Follow() {
  const navigate = useNavigate();
  const { userId, type } = useParams<{
    userId: string;
    type: "followers" | "following";
  }>();

  const { setHeaderConfig } = useHeader();
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✔ 헤더 설정
  useEffect(() => {
    if (!type || !userId) return;

    if (type !== "followers" && type !== "following") {
      navigate("/404", { replace: true });
      return;
    }

    const isFollowers = type === "followers";

    setHeaderConfig({
      show: true,
      type,
      title: isFollowers ? "팔로워" : "팔로잉",
      onBackClick: () => navigate(`/profile/${userId}`),
    });
  }, [type, userId, navigate]);

  // ✔ 데이터 로드
  useEffect(() => {
    if (!type || !userId) return;

    const isFollowers = type === "followers";

    const loadFollowList = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = isFollowers
          ? await fetchFollowers(userId)
          : await fetchFollowing(userId);

        setUsers(data);
      } catch (err) {
        console.error("팔로우 목록 로드 실패:", err);
        setError("목록을 불러오는데 실패했습니다.");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFollowList();
  }, [type, userId]);

  // ✔ 팔로우 토글 (낙관적 업데이트)
  const handleFollowToggle = useCallback(
    async (targetUserId: string) => {
      const target = users.find((u) => u.userId === targetUserId);
      if (!target) return;

      const prevUsers = [...users]; // 롤백용 복사본

      // 즉시 UI 반영
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === targetUserId ? { ...u, isFollowing: !u.isFollowing } : u
        )
      );

      try {
        await toggleFollow(targetUserId, target.isFollowing);
      } catch (err) {
        console.error("팔로우 처리 실패:", err);
        setUsers(prevUsers); // 실패 시 롤백
      }
    },
    [users]
  );

  return (
    <FollowListContainer>
      {isLoading && <EmptyState>불러오는 중...</EmptyState>}

      {!isLoading && users.length === 0 && (
        <EmptyState>
          {type === "followers"
            ? "팔로워가 없습니다."
            : "팔로잉한 사용자가 없습니다."}
        </EmptyState>
      )}

      {!isLoading &&
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