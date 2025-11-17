import {
  ProductSection,
  ProductTitle,
  ProductListContainer,
  ProductCard,
  ProductInfoBox,
  ProductName,
  ProductPrice,
} from "../SellingProducts.styled";
import {
  ProfileSection,
  ProfileContainer,
  ProfileTopSection,
  FollowStatBox,
  FollowText,
  FollowerValue,
  FollowingValue,
  UserInfoBox,
  UserName,
  UserId,
  UserDescription,
  ActionButtonsContainer,
  IconButton,
  LoadingText,
  MyFeedSection,
  PostListContainer,
} from "../Profile.styled";
import { PostCardContainer } from "../../../../components/post/postCard/PostCard.styled";
import SkeletonWrapper from "../../../../components/common/SkeletonWrapper";


export default function ProfileSkeleton() {
    return (
        <>
        <ProfileSection>
          <ProfileContainer>
            <ProfileTopSection>
              <FollowStatBox>
                <FollowerValue><SkeletonWrapper width={80} height={18} /></FollowerValue>
                <FollowText><SkeletonWrapper width={80} height={18} /></FollowText>
              </FollowStatBox>

              <SkeletonWrapper width={110} height={110} borderRadius={500} />

              <FollowStatBox>
                <FollowingValue><SkeletonWrapper width={80} height={18} /></FollowingValue>
                <FollowText><SkeletonWrapper width={80} height={18} /></FollowText>
              </FollowStatBox>
            </ProfileTopSection>

            <UserInfoBox>
              <UserName><SkeletonWrapper width={80} height={18} /></UserName>
              <UserId><SkeletonWrapper width={80} height={18} /></UserId>
            </UserInfoBox>

            <UserDescription><SkeletonWrapper width={80} height={14} /></UserDescription>

            {/* 액션 버튼 */}
            <ActionButtonsContainer>
              <SkeletonWrapper width={120} height={34} />
              <SkeletonWrapper width={120} height={34} />
            </ActionButtonsContainer>
          </ProfileContainer>
        </ProfileSection>
        {/* 상품 섹션 */}
        <ProductSection>
          <ProductTitle>
            <SkeletonWrapper width={80} height={18} />
          </ProductTitle>
            <ProductListContainer>
                <ProductCard>
                  <SkeletonWrapper width={140} height={90} />

                  <ProductInfoBox>
                    <ProductName><SkeletonWrapper width={80} height={18} /></ProductName>
                    <ProductPrice>
                      <SkeletonWrapper width={80} height={18} />
                    </ProductPrice>
                  </ProductInfoBox>
                </ProductCard>
            </ProductListContainer>

        </ProductSection>
        <MyFeedSection>
          <PostListContainer>
            <PostCardContainer>
              <div style={{display: 'flex', gap: '1.2rem' }}>
                <SkeletonWrapper width={42} height={42} borderRadius={500} />
                <div>
                  <SkeletonWrapper width={80} height={18} />
                  <SkeletonWrapper width={80} height={18} marginTop={5} />
                  <SkeletonWrapper width={200} height={18} marginTop={20} borderRadius={500} />
                  <SkeletonWrapper width={200} height={18} marginTop={5} borderRadius={500} />
                </div>
              </div>
            </PostCardContainer>
          </PostListContainer>
        </MyFeedSection>
        </>
    )
}