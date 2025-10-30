| 구분                              | HTTP   | Endpoint                          | 설명                              | 인증 |
| ------------------------------- | ------ | --------------------------------- | ------------------------------- | -- |
| **🔐 Auth (회원가입 / 로그인 / 탈퇴)**   |        |                                   |                                 |    |
|                                 | POST   | `/api/auth/signup`                | 회원가입 (email, password)          | ❌  |
|                                 | POST   | `/api/auth/login`                 | 로그인 (JWT 토큰 발급)                 | ❌  |
|                                 | POST   | `/api/auth/logout`                | 로그아웃 (JWT 무효화)                  | ✅  |
|                                 | DELETE | `/api/auth/withdraw`              | 회원 탈퇴                           | ✅  |
| **👤 User (프로필 / 팔로우 / 검색)**    |        |                                   |                                 |    |
|                                 | GET    | `/api/users/me`                   | 내 프로필 조회                        | ✅  |
|                                 | PUT    | `/api/users/me`                   | 내 프로필 수정 (username, bio, 이미지 등) | ✅  |
|                                 | GET    | `/api/users/{user_id}`            | 특정 사용자 프로필 조회                   | ✅  |
|                                 | POST   | `/api/users/{user_id}/follow`     | 사용자 팔로우                         | ✅  |
|                                 | DELETE | `/api/users/{user_id}/unfollow`   | 사용자 언팔로우                        | ✅  |
|                                 | GET    | `/api/users/{user_id}/followers`  | 팔로워 목록                          | ✅  |
|                                 | GET    | `/api/users/{user_id}/followings` | 팔로잉 목록                          | ✅  |
|                                 | GET    | `/api/users/{user_id}/likes`      | 특정 사용자가 좋아요한 게시글 목록             | ✅  |
|                                 | GET    | `/api/users/search?query=`        | 사용자 검색                          | ❌  |
| **🛍 Product (상품 등록 / 조회)**     |        |                                   |                                 |    |
|                                 | POST   | `/api/products`                   | 상품 등록 (이름, 가격, 설명, 이미지, 재고)     | ✅  |
|                                 | GET    | `/api/products/user/{user_id}`    | 특정 사용자의 상품 목록                   | ❌  |
|                                 | GET    | `/api/products/{product_id}`      | 상품 상세 조회                        | ❌  |
| **📝 Post (게시글 / 피드)**          |        |                                   |                                 |    |
|                                 | GET    | `/api/posts/feed`                 | 홈 피드 (팔로잉 유저 게시글 최신순)           | ✅  |
|                                 | POST   | `/api/posts`                      | 게시글 작성 (텍스트, 해시태그, 이미지)         | ✅  |
|                                 | GET    | `/api/posts/{post_id}`            | 게시글 상세 조회                       | ❌  |
|                                 | DELETE | `/api/posts/{post_id}`            | 게시글 삭제                          | ✅  |
|                                 | POST   | `/api/posts/{post_id}/likes`      | 게시글 좋아요 등록                      | ✅  |
|                                 | DELETE | `/api/posts/{post_id}/likes`      | 게시글 좋아요 취소                      | ✅  |
|                                 | GET    | `/api/posts/{post_id}/likes`      | 게시글 좋아요한 사용자 목록                 | ❌  |
|                                 | GET    | `/api/posts/user/{user_id}`       | 특정 사용자의 게시글 목록                  | ❌  |
| **💬 Comment (댓글)**             |        |                                   |                                 |    |
|                                 | POST   | `/api/posts/{post_id}/comments`   | 게시글에 댓글 작성                      | ✅  |
|                                 | GET    | `/api/posts/{post_id}/comments`   | 게시글 댓글 목록 조회                    | ❌  |
|                                 | DELETE | `/api/posts/{post_id}/comments/{comment_id}`      | 댓글 삭제                           | ✅  |
| **💭 Chat (1:1 채팅)**            |        |                                   |                                 |    |
|                                 | GET    | `/api/chats`                      | 내 채팅방 목록 조회                     | ✅  |
|                                 | POST   | `/api/chats/start`                | 새 채팅방 생성 (상대 user_id 입력)        | ✅  |
|                                 | GET    | `/api/chats/{chat_id}`            | 특정 채팅방 메시지 조회                   | ✅  |
|                                 | POST   | `/api/chats/{chat_id}/messages`   | 메시지 전송                          | ✅  |
|                                 | DELETE | `/api/chats/{chat_id}`            | 채팅방 나가기                         | ✅  |
| **🚨 Report (신고)** *(선택)*       |        |                                   |                                 |    |
|                                 | POST   | `/api/reports`                    | 유저/게시글/댓글/채팅/상품 신고 등록           | ✅  |
| **🤝 Recommend (친구 추천)** *(선택)* |        |                                   |                                 |    |
|                                 | GET    | `/api/recommend/friends`          | 해시태그 기반 친구 추천                   | ✅  |
