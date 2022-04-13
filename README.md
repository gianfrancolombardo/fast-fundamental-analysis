# FastFunctionalAnalysis

This project tries to ease and speed up one way of functional analysis based on the strategy taught in the course [Functional Analysis](https://platzi.com/cursos/inversion-bolsa/) on Platzi.

The goal is to get all ratios and calculate the intrinsic values for their post analysis. 

## Data source

All data is got by [Financial Modeling Prep](https://site.financialmodelingprep.com/) API. 

To use this tool you should have an API KEY. 
You can [register](https://site.financialmodelingprep.com/register) on their web with a **free** plan to get one.

### Free plan limitations
- 1 request per second
- 250 requests per day

**Note:** Each analysis use 5 requests to get all data, so you could do 50 analysis per day.

### Endpoints used 

#### Financial Ratios
Used to get company ratios in temporality TTM. For both, target and competitors. [Official Doc](https://site.financialmodelingprep.com/developer/docs#Company-Financial-Ratios)

```
/api/v3/ratios-ttm/<ticker>
```

#### Financial Historicl Ratios
Get company yearly ratios (last 5 years) and used them to calculate the average of some valuation ratios. [Official Doc](https://site.financialmodelingprep.com/developer/docs#Company-Financial-Ratios)

```
/api/v3/ratios/<ticker>
```

#### Stock price
Used to calcutate finals values. [Official Doc](https://site.financialmodelingprep.com/developer/docs#Stock-Price)

```
/api/v3/quote-short/<ticker>
```

## Formulas

### Values by Historical ratios
This formula is used in panel **Historical ratios**, column "Value" and mean the company value base on spesific valuation ratios (PER, PS, PBV)
``` typescript
value = ( price * historical_ratio ) / current_ratio

// Value example
priceEarningsValue = ( price * priceEarnings5Y ) / priceEarnings
```

### Value by historical
Average of company values by historical valuation ratio
``` typescript
valueByHistorical = ( priceEarningsValue + priceToSalesValue + priceBookValueValue ) / 3
```

### Value by industry
Average of the values obtained from the average of the Valuation ratios of the Target and its two competitors
``` typescript
values_ratios.push( ( price * avg.priceEarnings ) / priceEarnings ) 
// other valuation ratios

valueByIndustry = AVG( values_ratios )
```

## Indicators
Methods that try to summarize an aspect of the company based on a series of ratios

### Liquidity
``` typescript
/* 
    Ratios: Current Ratio, Quick Ratio, Cash Ratio
    Premise: Liquidity ratios > 1 are OK
    Logic: AVG of liquidity ratios > 1 are OK
*/

is_liquidity() {
    let avg = (target.currentRatio + target.quickRatio + target.cashRatio) / 3;
    return avg >= 1;
}
```
### Solvency
``` typescript
/* 
    Ratios: Debt/Equity
    Premise: Debt/Equity < 1 are OK
    Logic: Debt/Equity < 1 are OK
*/

is_solvency() {
    return target.debtEquity < 1;
}
```

### Efficiency
``` typescript
/* 
    Ratios: Inventory Turnover, Days Inventory, Assets Turnover
    Premise: TODO
    Logic: TODO
*/

is_efficiency() {
    // TODO
}
```

### Profitability
``` typescript
/* 
    Ratios: Return on equity, Net margin
    Premise: <10 Bad, 10-15 Good, 15-20 Very good, >20 Excelent
    Logic:  returnOnEquity and netMargin > 10 are OK
            returnOnEquity or netMargin > 10 are Regualr
            returnOnEquity and netMargin <> 10 are Bad
*/

is_profitability() {
    if (target.returnOnEquity > 10 && target.netMargin > 10)
      return 0 
    else if (target.returnOnEquity > 10 || target.netMargin > 10)
      return 1
    else
      return 2
}
```

### Valuation
``` typescript
/* 
    Ratios: Price Earning, Price Cash Flow, Price Sales, Price Book Value
    Premise: TODO
    Logic: TODO
*/

is_valuable() {
    // TODO
}
```

## License
[MIT](https://choosealicense.com/licenses/mit/)