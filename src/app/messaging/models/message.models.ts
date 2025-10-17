export interface Message {
  id?: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: MessageType;
  attachments?: MessageAttachment[];
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM'
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantAvatars?: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  jobId?: string;
  jobTitle?: string;
}

export interface SendMessageRequest {
  conversationId?: string;
  receiverId: string;
  content: string;
  type?: MessageType;
  jobId?: string;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  totalUnread: number;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface MessageNotification {
  conversationId: string;
  message: Message;
  totalUnread: number;
}

