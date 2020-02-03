import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  ListItem,
  Button,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TransactionResponseItem } from "../models";
import { useHistory } from "react-router";
import { isRequestTransaction } from "../utils/transactionUtils";

const useStyles = makeStyles({
  card: {
    minWidth: "100%"
  },
  title: {
    fontSize: 18
  },
  titleName: {
    fontSize: 18,
    color: "#1A202C"
  }
});

type TransactionProps = {
  transaction: TransactionResponseItem;
};

const TransactionItem: React.FC<TransactionProps> = ({ transaction }) => {
  const classes = useStyles();
  const history = useHistory();

  const TitleName: React.FC<{ name: string }> = ({ name }) => (
    <Typography className={classes.titleName} display="inline">
      {name}
    </Typography>
  );

  const Title: React.FC<{ children: any }> = ({ children }) => (
    <Typography color="textSecondary" className={classes.title} gutterBottom>
      {children}
    </Typography>
  );

  const headline = isRequestTransaction(transaction) ? (
    <Title>
      <TitleName name={transaction.senderName} /> charged{" "}
      <TitleName name={transaction.receiverName} />
    </Title>
  ) : (
    <Title>
      <TitleName name={transaction.senderName} /> paid{" "}
      <TitleName name={transaction.receiverName} />
    </Title>
  );

  const showTransactionDetail = (transactionId: string) => {
    history.push(`/transaction/${transactionId}`);
  };

  return (
    <ListItem
      data-test={`transaction-item-${transaction.id}`}
      onClick={() => showTransactionDetail(transaction.id)}
    >
      <Card className={classes.card}>
        <CardContent>
          {headline}
          <Typography variant="body2" color="textSecondary" component="p">
            {transaction.description}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            data-test={`transaction-like-count-${transaction.id}`}
          >
            Likes: {transaction.likes ? transaction.likes.length : 0}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            data-test={`transaction-comment-count-${transaction.id}`}
          >
            Comments: {transaction.comments ? transaction.comments.length : 0}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            size="small"
            onClick={() => showTransactionDetail(transaction.id)}
            data-test={`transaction-view-${transaction.id}`}
          >
            View Transaction
          </Button>
        </CardActions>
      </Card>
    </ListItem>
  );
};

export default TransactionItem;
