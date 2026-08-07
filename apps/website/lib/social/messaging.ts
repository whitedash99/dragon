export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface FriendRelation {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  status: "Online" | "In Game" | "Offline";
  currentGame?: string;
}

export interface GroupChatRoom {
  id: string;
  name: string;
  membersCount: number;
  lastMessage: string;
  updatedAt: string;
}

export class SocialMessagingService {
  /**
   * Returns current user's active friends list.
   */
  static getFriendsList(): FriendRelation[] {
    return [
      {
        id: "fr-1",
        userId: "usr-4092",
        friendId: "usr-1024",
        friendName: "ValkyrieStream",
        friendAvatar: "VS",
        status: "In Game",
        currentGame: "Neon Drift: Overdrive",
      },
      {
        id: "fr-2",
        userId: "usr-4092",
        friendId: "usr-5012",
        friendName: "Tactical Zenith",
        friendAvatar: "TZ",
        status: "Online",
      },
      {
        id: "fr-3",
        userId: "usr-4092",
        friendId: "usr-9011",
        friendName: "Elena Rostova",
        friendAvatar: "ER",
        status: "Offline",
      },
    ];
  }
}
