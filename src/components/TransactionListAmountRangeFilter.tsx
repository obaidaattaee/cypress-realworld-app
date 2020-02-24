import React from "react";
import {
  makeStyles,
  Grid,
  Popover,
  Typography,
  Slider,
  Chip,
  Button
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { TransactionQueryPayload } from "../models";
import {
  formatAmountRangeValues,
  amountRangeValueText,
  amountRangeValueTextLabel,
  padAmountWithZeros
  //hasAmountQueryFields
} from "../utils/transactionUtils";
import { first, last } from "lodash/fp";

const useStyles = makeStyles(theme => ({
  amountRangeRoot: {
    width: 300,
    margin: 30
  },
  amountRangeTitleRow: {
    width: "100%"
  },
  amountRangeTitle: {
    width: 225
  },
  amountRangeSlider: {
    width: 200
  }
}));

export type TransactionListAmountRangeFilterProps = {
  filterTransactions: Function;
  transactionFilters: TransactionQueryPayload;
  clearTransactionFilters: Function;
};

const TransactionListAmountRangeFilter: React.FC<TransactionListAmountRangeFilterProps> = ({
  filterTransactions,
  transactionFilters,
  clearTransactionFilters
}) => {
  const classes = useStyles();
  // TODO use in place of state
  /*
  const queryHasAmountFields =
    transactionFilters && hasAmountQueryFields(transactionFilters);

  const amountRangeValues = (transactionFilters: TransactionQueryPayload) => {
    if (queryHasAmountFields) {
      const { amountMin, amountMax } = getAmountQueryFields(transactionFilters);
      return [amountMin, amountMax] as number[];
    }
    return [0, 100] as number[];
  };
  */

  const initialAmountRange = [0, 100];
  const [amountRangeValue, setAmountRangeValue] = React.useState<number[]>(
    initialAmountRange
  );

  const [
    amountRangeAnchorEl,
    setAmountRangeAnchorEl
  ] = React.useState<HTMLDivElement | null>(null);

  const handleAmountRangeClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAmountRangeAnchorEl(event.currentTarget);
  };

  const handleAmountRangeClose = () => {
    setAmountRangeAnchorEl(null);
  };

  const handleAmountRangeChange = (
    _event: any,
    amountRange: number | number[]
  ) => {
    filterTransactions({
      amountMin: padAmountWithZeros(first(amountRange as number[]) as number),
      amountMax: padAmountWithZeros(last(amountRange as number[]) as number)
    });
    setAmountRangeValue(amountRange as number[]);
  };

  const amountRangeOpen = Boolean(amountRangeAnchorEl);
  const amountRangeId = amountRangeOpen ? "amount-range-popover" : undefined;

  return (
    <div>
      <Chip
        color="primary"
        variant="outlined"
        onClick={handleAmountRangeClick}
        data-test="transaction-list-filter-amount-range-button"
        label={`Amount Range: ${formatAmountRangeValues(amountRangeValue)}`}
        deleteIcon={<ArrowDropDownIcon />}
        onDelete={handleAmountRangeClick}
      />
      <Popover
        id={amountRangeId}
        open={amountRangeOpen}
        anchorEl={amountRangeAnchorEl}
        onClose={handleAmountRangeClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          spacing={1}
          className={classes.amountRangeRoot}
        >
          <Grid item>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              className={classes.amountRangeTitleRow}
            >
              <Grid item className={classes.amountRangeTitle}>
                <Typography
                  color="textSecondary"
                  data-test="transaction-list-filter-amount-range-text"
                >
                  Amount Range: {formatAmountRangeValues(amountRangeValue)}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  data-test="transaction-list-filter-amount-clear-button"
                  onClick={() => {
                    setAmountRangeValue(initialAmountRange);
                    clearTransactionFilters({ filterType: "amount" });
                  }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Slider
              data-test="transaction-list-filter-amount-range-slider"
              className={classes.amountRangeSlider}
              value={amountRangeValue}
              min={0}
              max={100}
              onChange={handleAmountRangeChange}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              getAriaValueText={amountRangeValueText}
              valueLabelFormat={amountRangeValueTextLabel}
            />
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
};

export default TransactionListAmountRangeFilter;
