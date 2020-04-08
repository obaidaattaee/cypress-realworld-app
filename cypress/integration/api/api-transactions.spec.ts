// check this file using TypeScript if available
// @ts-check

import faker from "faker";
const getFakeAmount = () => parseInt(faker.finance.amount(), 10);

const apiTransactions = `${Cypress.env("apiUrl")}/transactions`;

describe("Transactions API", function () {
  before(function () {
    //cy.task("db:reset");
    cy.task("db:seed");
    // TODO: Refactor
    // hacks/experiements
    cy.fixture("users").as("users");
    cy.fixture("contacts").as("contacts");
    cy.fixture("bankAccounts").as("bankAccounts");
    cy.fixture("transactions").as("transactions");
    cy.get("@users").then((user) => (this.currentUser = this.users[0]));
    cy.get("@contacts").then((contacts) => (this.contacts = contacts));
    cy.get("@bankAccounts").then((accounts) => (this.bankAccounts = accounts));
    cy.get("@transactions").then(
      (transactions) => (this.transactions = transactions)
    );
  });

  beforeEach(function () {
    const { username } = this.currentUser;
    cy.apiLogin(username);
  });

  afterEach(function () {
    //cy.task("db:reset");
    cy.task("db:seed");
  });

  context("GET /transactions", function () {
    it("gets a list of transactions for user (default)", function () {
      const { id } = this.currentUser;
      cy.request("GET", `${apiTransactions}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.results[2].senderId).to.eq(id);
      });
    });

    it("gets a list of pending request transactions for user", function () {
      const { id } = this.currentUser;
      cy.request({
        method: "GET",
        url: `${apiTransactions}`,
        qs: {
          requestStatus: "pending",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.results[0].receiverId).to.eq(id);
      });
    });

    it("gets a list of pending request transactions for user between a time range", function () {
      const { id } = this.currentUser;
      cy.request({
        method: "GET",
        url: `${apiTransactions}`,
        qs: {
          requestStatus: "pending",
          dateRangeStart: new Date("Dec 01 2019"),
          dateRangeEnd: new Date("Dec 05 2019"),
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.results.length).to.eq(1);
      });
    });
  });

  context("GET /transactions/contacts", function () {
    it("gets a list of transactions for users list of contacts, page one", function () {
      cy.request("GET", `${apiTransactions}/contacts`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.results.length).to.eq(10);
      });
    });

    it("gets a list of transactions for users list of contacts, page two", function () {
      cy.request("GET", `${apiTransactions}/contacts?page=2`).then(
        (response) => {
          expect(response.status).to.eq(200);
          expect(response.body.results.length).to.eq(7);
        }
      );
    });

    it("gets a list of transactions for users list of contacts - status 'incomplete'", function () {
      cy.request({
        method: "GET",
        url: `${apiTransactions}/contacts`,
        qs: {
          status: "incomplete",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.results.length).to.eq(3);
      });
    });
  });

  context("GET /transactions/public", function () {
    it("gets a list of public transactions", function () {
      cy.request("GET", `${apiTransactions}/public`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.results.length).to.eq(8);
      });
    });
  });

  context("POST /transactions", function () {
    it("creates a new payment", function () {
      const sender = this.currentUser;
      const receiver = this.users[1];
      const senderBankAccount = this.bankAccounts[0];

      cy.request("POST", `${apiTransactions}`, {
        transactionType: "payment",
        source: senderBankAccount.id,
        receiverId: receiver.id,
        description: `Payment: ${sender.id} to ${receiver.id}`,
        amount: getFakeAmount(),
        privacyLevel: "public",
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.transaction.id).to.be.a("string");
        expect(response.body.transaction.status).to.eq("pending");
        expect(response.body.transaction.requestStatus).to.eq(undefined);
      });
    });

    it("creates a new request", function () {
      const sender = this.currentUser;
      const receiver = this.users[1];
      const senderBankAccount = this.bankAccounts[0];

      cy.request("POST", `${apiTransactions}`, {
        transactionType: "request",
        source: senderBankAccount.id,
        receiverId: receiver.id,
        description: `Request: ${sender.id} from ${receiver.id}`,
        amount: getFakeAmount(),
        privacyLevel: "public",
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.transaction.id).to.be.a("string");
        expect(response.body.transaction.status).to.eq("pending");
        expect(response.body.transaction.requestStatus).to.eq("pending");
      });
    });
  });

  context("PATCH /transactions/:transactionId", function () {
    it("updates a transaction", function () {
      const transaction = this.transactions[0];

      cy.request("PATCH", `${apiTransactions}/${transaction.id}`, {
        requestStatus: "rejected",
      }).then((response) => {
        expect(response.status).to.eq(204);
      });
    });

    it("error when invalid field sent", function () {
      const transaction = this.transactions[0];

      cy.request({
        method: "PATCH",
        url: `${apiTransactions}/${transaction.id}`,
        failOnStatusCode: false,
        body: {
          notAUserField: "not a user field",
        },
      }).then((response) => {
        expect(response.status).to.eq(422);
        expect(response.body.errors.length).to.eq(1);
      });
    });
  });
});
