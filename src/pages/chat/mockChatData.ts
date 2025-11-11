import type {ChatMessage} from './ChatRoom';

export const mockResponsesByRoom: Record<string, ChatMessage[][]> = {
    "1": [
            [
                { id: 'r1', userId: 'other1', username: '철갑상어', type: 'text', content: '안녕하세요!', timestamp: Date.now() },
                { id: 'r2', userId: 'other1', username: '철갑상어', type: 'text', content: '아직 분양 전입니다^^', timestamp: Date.now() + 1500 },
            ],
            [
                { id: 'r3', userId: 'other1', username: '철갑상어', type: 'text', content: '8천원까지 해드릴게요', timestamp: Date.now() + 1500 },
            ],
            [
                { id: 'r4', userId: 'other1', username: '철갑상어', type: 'text', content: '평일 7시 이후 가능합니다~^^', timestamp: Date.now() + 1500 },
                { id: 'r5', userId: 'other1', username: '철갑상어', type: 'text', content: '망포역까지 오실 수 있나요?', timestamp: Date.now() + 1500 },
            ],
    ],
    "2": [
        [
            { id: 'r6', userId: 'other2', username: 'ggamjang12', type: 'text', content: '2번 방 테스트', timestamp: Date.now() },
        ]
    ],
    "3": [
        [
            { id: 'r7', userId: 'other3', username: '붕어빵', type: 'image', content: '/img/sample.png', timestamp: Date.now() },
        ]
    ],
};

