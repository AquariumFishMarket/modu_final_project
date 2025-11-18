import { PostCardContainer } from "../../../components/post/postCard/PostCard.styled"
import SkeletonWrapper from "../../../components/common/SkeletonWrapper"

export default function FeedSkeleton() {
    return (
        <>
        <PostCardContainer>
            <div style={{display: 'flex', gap: '1.2rem' }}>
                <SkeletonWrapper width={42} height={42} borderRadius={500} />
                <div>
                    <SkeletonWrapper width={80} height={18} />
                    <SkeletonWrapper width={80} height={18} marginTop={5} />
                    <SkeletonWrapper width={300} height={18} marginTop={20} borderRadius={500} />
                    <SkeletonWrapper width={350} height={18} marginTop={5} borderRadius={500} />
                </div>
            </div>
        </PostCardContainer>
        <PostCardContainer>
            <div style={{display: 'flex', gap: '1.2rem' }}>
                <SkeletonWrapper width={42} height={42} borderRadius={500} />
                <div>
                    <SkeletonWrapper width={80} height={18} />
                    <SkeletonWrapper width={80} height={18} marginTop={5} />
                    <SkeletonWrapper width={300} height={18} marginTop={20} borderRadius={500} />
                    <SkeletonWrapper width={350} height={18} marginTop={5} borderRadius={500} />
                </div>
            </div>
        </PostCardContainer>
        <PostCardContainer>
            <div style={{display: 'flex', gap: '1.2rem' }}>
                <SkeletonWrapper width={42} height={42} borderRadius={500} />
                <div>
                    <SkeletonWrapper width={80} height={18} />
                    <SkeletonWrapper width={80} height={18} marginTop={5} />
                    <SkeletonWrapper width={300} height={18} marginTop={20} borderRadius={500} />
                    <SkeletonWrapper width={350} height={18} marginTop={5} borderRadius={500} />
                </div>
            </div>
        </PostCardContainer>
        <PostCardContainer>
            <div style={{display: 'flex', gap: '1.2rem' }}>
                <SkeletonWrapper width={42} height={42} borderRadius={500} />
                <div>
                    <SkeletonWrapper width={80} height={18} />
                    <SkeletonWrapper width={80} height={18} marginTop={5} />
                    <SkeletonWrapper width={300} height={18} marginTop={20} borderRadius={500} />
                    <SkeletonWrapper width={350} height={18} marginTop={5} borderRadius={500} />
                </div>
            </div>
        </PostCardContainer>
        <PostCardContainer>
            <div style={{display: 'flex', gap: '1.2rem' }}>
                <SkeletonWrapper width={42} height={42} borderRadius={500} />
                <div>
                    <SkeletonWrapper width={80} height={18} />
                    <SkeletonWrapper width={80} height={18} marginTop={5} />
                    <SkeletonWrapper width={300} height={18} marginTop={20} borderRadius={500} />
                    <SkeletonWrapper width={350} height={18} marginTop={5} borderRadius={500} />
                </div>
            </div>
        </PostCardContainer>
        <PostCardContainer>
            <div style={{display: 'flex', gap: '1.2rem' }}>
                <SkeletonWrapper width={42} height={42} borderRadius={500} />
                <div>
                    <SkeletonWrapper width={80} height={18} />
                    <SkeletonWrapper width={80} height={18} marginTop={5} />
                    <SkeletonWrapper width={300} height={18} marginTop={20} borderRadius={500} />
                    <SkeletonWrapper width={350} height={18} marginTop={5} borderRadius={500} />
                </div>
            </div>
        </PostCardContainer>
        </>
    )
}