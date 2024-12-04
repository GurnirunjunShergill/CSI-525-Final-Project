import * as React from "react";
import { useState } from "react";
import { storeBudget } from "../../helper/storageHelper";
import {
  BudgetDataType,
  BudgetItemType,
  BudgetListType,
} from "../../types/BudgetDataType";
import { getDate, getWeek } from "../../helper/dataHelper";
import { monthList } from "../../Constants";
import './addfinances.css';

interface AddFinancesPropsType {
  budgetData: any;
  setBudgetData: React.Dispatch<React.SetStateAction<any>>;
}

const AddFinances = ({ budgetData, setBudgetData }: AddFinancesPropsType) => {
  const defaultBudgetItemValue = {
    budgetItemName: "",
    budgetItemType: "food (groceries)",
    budgetItemAmount: 0,
  };
  // TODO add a type
  const [listOfFinanceInputs, setListOfFinanceInputs] = useState([]);
  const currentDate = getDate("today");
  const [budgetDate, setBudgetDate] = useState<string>(currentDate);

  const addBudgetItemInput = (event: any) => {
    event.preventDefault();
    setListOfFinanceInputs([...listOfFinanceInputs, defaultBudgetItemValue]);
  };
  const updateBudgetDate = (event: any) => {
    setBudgetDate(event.target.value);
    if (budgetData) {
      const currentDateIndex = findDateBudgetIndex(
        budgetData,
        event.target.value
      );
      if (currentDateIndex > -1)
        setListOfFinanceInputs([
          ...budgetData?.budgets[currentDateIndex]?.budget,
        ]);
      else setListOfFinanceInputs([]);
    }
  };

  const updateBudgetItem = ({
    event,
    index,
    valueToBeUpdated,
  }: {
    event: any;
    index: number;
    valueToBeUpdated: string;
  }) => {
    const updatedValue =
      valueToBeUpdated === "budgetItemAmount"
        ? Number(event.target.value)
        : event.target.value;
    listOfFinanceInputs[index][valueToBeUpdated] = updatedValue;
  };

  const getBudgetTotal = (listOfFinanceInputs: any) => {
    let total = 0;
    listOfFinanceInputs.map(
      (budget: any) => (total = total + budget.budgetItemAmount)
    );
    return total;
  };

  const findDateBudgetIndex = (budgetData: any, budgetDate: string) => {
    return budgetData?.budgets
      ? budgetData.budgets
          .map((budgetItem: any) => budgetItem.budgetDate)
          .indexOf(budgetDate)
      : -1;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const id: number =
      budgetData && budgetData?.budgets ? budgetData?.budgets?.length : 0;
    let udpatedBudget: BudgetItemType[];
    const indexOfExistingDateData: number = findDateBudgetIndex(
      budgetData,
      budgetDate
    );
    const budgetTotal: number = getBudgetTotal(listOfFinanceInputs);
    const week = getWeek(budgetDate);
    console.log(week);

    // budget data doesn't exist
    if (budgetData.notYetDefinedFlag)
      udpatedBudget = [
        {
          id: id,
          budgetTotal: budgetTotal,
          budgetDate: budgetDate,
          budget: listOfFinanceInputs,
          budgetVariance: budgetData.goals.dailyBudget - budgetTotal,
        },
      ];
    // budget data exists but the current date is not accounted for
    else if (indexOfExistingDateData > -1) {
      budgetData.budgets[indexOfExistingDateData].budget = listOfFinanceInputs;
      budgetData.budgets[indexOfExistingDateData].budgetTotal = budgetTotal;
      budgetData.budgets[indexOfExistingDateData].budgetVariance =
        budgetData.goals.dailyBudget - budgetTotal;

      udpatedBudget = [...budgetData.budgets];
      // budget data exists and the current date is accounted for and should be overwritten
    } else
      udpatedBudget = [
        ...budgetData.budgets,
        {
          id: id,
          budgetTotal: budgetTotal,
          budgetDate: budgetDate,
          budget: listOfFinanceInputs,
          budgetVariance: budgetData.goals.dailyBudget - budgetTotal,
        },
      ];

    const finalData: BudgetDataType = {
      budgets: udpatedBudget,
      ...(budgetData?.goals && { goals: { ...budgetData.goals } }),
      notYetDefinedFlag: false,
    };

    storeBudget(finalData);
    setBudgetData(finalData);
    setListOfFinanceInputs([]);
  };

  const handleSubmitV2 = (event: any) => {
    event.preventDefault();
    const id: number =
      budgetData && budgetData?.budgets ? budgetData?.budgets?.length : 0;
    const year = budgetDate.substring(0, 4);
    const month = monthList[budgetDate.substring(6, 8)].name;
    const week = getWeek(currentDate);

    let udpatedBudget: BudgetItemType[];
    const indexOfExistingDateData: number = findDateBudgetIndex(
      budgetData,
      budgetDate
    );
    const budgetTotal: number = getBudgetTotal(listOfFinanceInputs);

    // budget data doesn't exist
    if (budgetData.notYetDefinedFlag)
      udpatedBudget = [
        {
          id: id,
          budgetTotal: budgetTotal,
          budgetDate: budgetDate,
          budget: listOfFinanceInputs,
          budgetVariance: budgetData.goals.dailyBudget - budgetTotal,
        },
      ];
    // budget data exists but the current date is not accounted for
    else if (indexOfExistingDateData > -1) {
      budgetData.budgets[indexOfExistingDateData].budget = listOfFinanceInputs;
      budgetData.budgets[indexOfExistingDateData].budgetTotal = budgetTotal;
      budgetData.budgets[indexOfExistingDateData].budgetVariance =
        budgetData.goals.dailyBudget - budgetTotal;

      udpatedBudget = [...budgetData.budgets];
      // budget data exists and the current date is accounted for and should be overwritten
    } else
      udpatedBudget = [
        ...budgetData.budgets,
        {
          id: id,
          budgetTotal: budgetTotal,
          budgetDate: budgetDate,
          budget: listOfFinanceInputs,
          budgetVariance: budgetData.goals.dailyBudget - budgetTotal,
        },
      ];

    const finalData: BudgetDataType = {
      budgets: udpatedBudget,
      ...(budgetData?.goals && { goals: { ...budgetData.goals } }),
      notYetDefinedFlag: false,
    };

    storeBudget(finalData);
    setBudgetData(finalData);
    setListOfFinanceInputs([]);
  };

  return (
    <div className='add-finances'>
      <form>
        <label>Date of Entry</label>
        <input type="date" onChange={updateBudgetDate} />
        {listOfFinanceInputs.map((item, index) => {
          return (
            <div className='add-finance-item' id={`${index}`} key={index}>
              <label>Budget Item Name</label>
              <input
                defaultValue={item.budgetItemName}
                onChange={() =>
                  updateBudgetItem({
                    event,
                    index,
                    valueToBeUpdated: "budgetItemName",
                  })
                }
              />
              <label>Budget Item Type</label>
              <select
                defaultValue={item.budgetItemType}
                onChange={() =>
                  updateBudgetItem({
                    event,
                    index,
                    valueToBeUpdated: "budgetItemType",
                  })
                }
              >
                <option value="food (groceries)">food (groceries)</option>
                <option value="rent">rent</option>
                <option value="video games">video games</option>
                <option value="food (non-groceries)">
                  food (non groceries)
                </option>
              </select>
              <label>Budget Item Amount</label>
              <input
                defaultValue={item.budgetItemAmount}
                type="number"
                onChange={() =>
                  updateBudgetItem({
                    event,
                    index,
                    valueToBeUpdated: "budgetItemAmount",
                  })
                }
              />
            </div>
          );
        })}
        <button onClick={addBudgetItemInput}>add item</button>
        <button onClick={handleSubmit}>submit</button>
      </form>
    </div>
  );
};

export default AddFinances;
