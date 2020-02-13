import {
  isRequestTransaction,
  getFakeAmount,
  currentUserLikesTransaction
} from "../transactionUtils";
import faker from "faker";
import {
  Transaction,
  TransactionRequestStatus,
  DefaultPrivacyLevel,
  TransactionStatus,
  TransactionResponseItem
} from "../../models";
import shortid from "shortid";

const fakeTransaction = (
  requestStatus?: TransactionRequestStatus
): Transaction => ({
  id: shortid(),
  uuid: faker.random.uuid(),
  source: shortid(),
  amount: getFakeAmount(),
  description: "food",
  privacyLevel: DefaultPrivacyLevel.public,
  receiverId: shortid(),
  senderId: shortid(),
  balanceAtCompletion: getFakeAmount(),
  status: TransactionStatus.pending,
  requestStatus,
  requestResolvedAt: faker.date.future(),
  createdAt: faker.date.past(),
  modifiedAt: faker.date.recent()
});

describe("isRequestTransaction", () => {
  let transaction;

  test("validates that a transaction is a request", () => {
    for (let s in TransactionRequestStatus) {
      transaction = fakeTransaction(s as TransactionRequestStatus);
      expect(isRequestTransaction(transaction)).toBeTruthy();
    }
  });

  test("validates that a transaction is not a request", () => {
    transaction = fakeTransaction();
    expect(isRequestTransaction(transaction)).toBe(false);
  });

  test("checks if the current user likes a transaction", () => {
    const transactionBase = fakeTransaction();

    const currentUser = {
      id: "9IUK0xpw",
      uuid: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      password: "abc123",
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber(),
      avatar: faker.internet.avatar(),
      defaultPrivacyLevel: DefaultPrivacyLevel.public,
      balance: faker.random.number(),
      createdAt: faker.date.past(),
      modifiedAt: faker.date.recent()
    };

    const transactionWithLikes: TransactionResponseItem = {
      ...transactionBase,
      receiverName: "Receiver Name",
      senderName: "Sender Name",
      likes: [
        {
          id: "ExVksKSH",
          uuid: "c849329f-42f7-4ff5-a792-e01c9cec05b5",
          userId: "9IUK0xpw",
          transactionId: "dKAI-6Ua",
          createdAt: new Date(),
          modifiedAt: new Date()
        }
      ],
      comments: []
    };

    expect(currentUserLikesTransaction(currentUser, transactionWithLikes)).toBe(
      true
    );

    const otherCurrentUser = {
      ...currentUser,
      id: "ABC123"
    };

    expect(
      currentUserLikesTransaction(otherCurrentUser, transactionWithLikes)
    ).toBe(false);
  });
});
