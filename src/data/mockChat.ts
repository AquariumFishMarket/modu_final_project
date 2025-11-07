export interface MessageType {
    senderId: string;
    senderName: string;
    senderProfile?: string;
    messageType: 'text' | 'image';
    message?: string;
    imageUrl?: string[];
    timestamp: string | Date;
}

export const mockMessages:MessageType[] = [
    {
        senderId: "user123",
        senderName: "홍길동",
        senderProfile: "https://example.com/profile.jpg",
        messageType: 'text',
        message: "ㅇㅎ",
        timestamp: "2025-11-05T12:20:00Z",
    },
    {
        senderId: "me",
        senderName: "나",
        senderProfile: "",
        messageType: 'text',
        message: "잉어킹 갸라도스",
        timestamp: "2025-11-05T12:21:00Z",
    },
];
