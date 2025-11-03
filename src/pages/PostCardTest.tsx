import PostCard from '../components/common/postcard/PostCard';

function PostCardTest() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f7f7f7',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#0f1419' }}>
        PostCard Component Test
      </h1>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* 첫 번째 카드 */}
        <PostCard
          userName="서귀포시 한라봉 타운"
          userId="@hanlabong22"
          avatarSrc="/img/fish-logo-GB.png"
          avatarAlt="프로필 이미지"
          content="감귤 잘 자라는 중... ❤️"
          imageSrc="/img/fish-logo-GB.png"
          imageAlt="게시글 이미지"
          dateTime="2025-10-21"
          dateText="2025년 10월 21일"
          likeCount={12}
          commentCount={3}
          isLiked={false}
        />

        {/* 두 번째 카드 */}
        <PostCard
          userName="감귤농장"
          userId="@citrusfarm"
          avatarSrc="/img/fish-logo-GB.png"
          avatarAlt="프로필 이미지"
          content="오늘 수확한 신선한 감귤입니다! 🍊"
          imageSrc="/img/cook.png"
          imageAlt="감귤 이미지"
          dateTime="2025-10-20"
          dateText="2025년 10월 20일"
          likeCount={25}
          commentCount={8}
          isLiked={true}
        />
      </div>
    </div>
  );
}

export default PostCardTest;
