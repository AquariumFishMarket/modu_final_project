import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHeader } from "../../contexts/HeaderContext";
import FollowUserCard from "../../components/common/follow/FollowUserCard";
import {
  dummyFollowers,
  dummyFollowing,
  type FollowUser,
} from "../../data/dummyFollowData";
// import {
//   fetchFollowers,
//   fetchFollowing,
//   toggleFollow,
// } from "../../services/followService";
import { FollowListContainer, EmptyState } from "./follow.styled";

// 팔로우 목록 페이지
// URL: /profile/:userId/followers 또는 /profile/:userId/following
function Follow() {
  const navigate = useNavigate();
  const { userId, type } = useParams<{
    userId: string;
    type: "followers" | "following";
  }>();

  const { setHeaderConfig } = useHeader();
  const [users, setUsers] = useState<FollowUser[]>([]);
  // const [isLoading, setIsLoading] = useState(false); // API 연동 시 사용
  // const [error, setError] = useState<string | null>(null); // API 연동 시 사용

  // 헤더 설정
  useEffect(() => {
    console.log("Follow 컴포넌트 마운트/업데이트:", { userId, type });

    if (!type || !userId) return;

    // 잘못된 type 값 가드
    if (type !== "followers" && type !== "following") {
      navigate("/404", { replace: true });
      return;
    }

    const isFollowers = type === "followers";

    setHeaderConfig({
      show: true,
      type,
      title: isFollowers ? "팔로워" : "팔로잉",
      onBackClick: () => {
        // userId는 이미 디코딩된 상태이므로 그대로 사용
        navigate(`/profile/${userId}`, { replace: false });
      },
    });
  }, [type, userId, navigate]);

  // 데이터 로드
  useEffect(() => {
    if (!type || !userId) return;

    const isFollowers = type === "followers";

    // 더미 데이터 사용
    setUsers(isFollowers ? dummyFollowers : dummyFollowing);

    // API 연동 시
    // const loadFollowList = async () => {
    //   setIsLoading(true);
    //   setError(null);
    //   try {
    //     const data = isFollowers
    //       ? await fetchFollowers(userId)
    //       : await fetchFollowing(userId);
    //     setUsers(data);
    //   } catch (err) {
    //     console.error("팔로우 목록 로드 실패:", err);
    //     setError("목록을 불러오는데 실패했습니다.");
    //     setUsers([]);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    //
    // loadFollowList();
  }, [type, userId]);

  const handleFollowToggle = useCallback(
    async (targetUserId: string) => {
      const target = users.find((u) => u.userId === targetUserId);
      if (!target) return;

      // 롤백용 복사본 (API 연동 시 사용)
      // const prevUsers = [...users];

      // 낙관적 업데이트
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === targetUserId ? { ...u, isFollowing: !u.isFollowing } : u
        )
      );

      // 더미 데이터 사용 시에는 여기서 종료
      // API 연동 시 아래 주석 해제
      /*
      try {
        await toggleFollow(targetUserId, target.isFollowing);
      } catch (err) {
        console.error("팔로우 처리 실패:", err);
        // 실패 시 롤백
        setUsers(prevUsers);
        // 에러 토스트 표시 등 추가 가능
        // showErrorToast("팔로우 처리에 실패했습니다.");
      }
      */
    },
    [users]
  );

  return (
    <FollowListContainer>
      {users.length === 0 ? (
        <EmptyState>
          {type === "followers"
            ? "팔로워가 없습니다."
            : "팔로잉한 사용자가 없습니다."}
        </EmptyState>
      ) : (
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
        ))
      )}
    </FollowListContainer>
  );
}

export default Follow;
