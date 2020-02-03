import { DefaultPrivacyLevel } from "./user";
import { Like, Comment } from ".";

export enum TransactionStatus {
  pending = "pending",
  incomplete = "incomplete",
  complete = "complete"
}

export enum RequestStatus {
  pending = "pending",
  accepted = "accepted",
  rejected = "rejected"
}

export interface Transaction {
  id: string;
  uuid: string;
  source: string; // Empty if Payment or Request; Populated with BankAccount ID
  amount: string;
  description: string;
  privacyLevel: DefaultPrivacyLevel;
  receiverId: string;
  senderId: string;
  balanceAtCompletion?: string;
  status: TransactionStatus;
  requestStatus?: RequestStatus;
  requestResolvedAt?: Date;
  createdAt: Date;
  modifiedAt: Date;
}

export interface TransactionResponseItem extends Transaction {
  likes: Like[];
  comments: Comment[];
  receiverName: string;
  senderName: string;
}
