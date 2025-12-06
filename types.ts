
export interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
  isMe: boolean;
}

export interface Message {
  id:string;
  text: string;
  senderId: string;
}
