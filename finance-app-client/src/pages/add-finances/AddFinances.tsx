import * as React from "react";
import { useState } from "react";
import { getDate } from "../../helper/dataHelper";
import './addfinances.css';
import { auth } from "../../firebase";

const AddFinances = ({ selectedBudget, budgetData, setBudgetData, userData, selectedBudgetIndex }: any) => {
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
    if (selectedBudget) {
      const currentDateIndex = findDateBudgetIndex(
        selectedBudget,
        event.target.value
      );
      if (currentDateIndex > -1)
        setListOfFinanceInputs([
          ...selectedBudget?.budgets[currentDateIndex]?.budget,
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

  const findDateBudgetIndex = (selectedBudget: any, budgetDate: string) => {
    return selectedBudget?.budgets
      ? selectedBudget.budgets
          .map((budgetItem: any) => budgetItem.date)
          .indexOf(budgetDate)
      : -1;
  };

  const handleSubmit = async(event: any) => {
    event.preventDefault();
    // const id: number =
    //   selectedBudget && selectedBudget?.budgets ? selectedBudget?.budgets?.length : 0;
    let updatedSelectedBudget = selectedBudget
    // const indexOfExistingDateData: number = findDateBudgetIndex(
    //   selectedBudget,
    //   budgetDate
    // );
    // const budgetTotal: number = getBudgetTotal(listOfFinanceInputs);
    // const week = getWeek(budgetDate);


    if(selectedBudget?.budgets){
      updatedSelectedBudget.budgets = [
        ...updatedSelectedBudget.budgets,
        {
          date: budgetDate,
          budget: listOfFinanceInputs
        }
      ]
    }else{
      updatedSelectedBudget.budgets = [
        {
          date: budgetDate,
          budget: listOfFinanceInputs
        }
      ]
    }

    let updatedBudget = budgetData;
    updatedBudget[selectedBudgetIndex] = updatedSelectedBudget

    const token = await auth.currentUser.getIdToken();

    const response = await fetch("http://localhost:3000/add-budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email: userData.email, budgetData: updatedBudget, budgetName: selectedBudget['budget-name'] }),
    });

    if(response.status === 200){
      const data = await response.json();
      console.log(data)
      setBudgetData(data.budgetData)
    }

    // budget data doesn't exist
    // if (selectedBudget.notYetDefinedFlag)
    //   updatedSelectedBudget = [
    //     {
    //       id: id,
    //       budgetTotal: budgetTotal,
    //       budgetDate: budgetDate,
    //       budget: listOfFinanceInputs,
    //       budgetVariance: selectedBudget.goal.dailyBudget - budgetTotal,
    //     },
    //   ];
    // // budget data exists but the current date is not accounted for
    // else if (indexOfExistingDateData > -1) {
    //   selectedBudget.budgets[indexOfExistingDateData].budget = listOfFinanceInputs;
    //   selectedBudget.budgets[indexOfExistingDateData].budgetTotal = budgetTotal;
    //   selectedBudget.budgets[indexOfExistingDateData].budgetVariance =
    //     selectedBudget.goal.dailyBudget - budgetTotal;

    //   updatedSelectedBudget = [...selectedBudget.budgets];
    //   // budget data exists and the current date is accounted for and should be overwritten
    // } else
    //   updatedSelectedBudget = [
    //     ...selectedBudget.budgets,
    //     {
    //       id: id,
    //       budgetTotal: budgetTotal,
    //       budgetDate: budgetDate,
    //       budget: listOfFinanceInputs,
    //       budgetVariance: selectedBudget.goal.dailyBudget - budgetTotal,
    //     },
    //   ];

    // const finalData: BudgetDataType = {
    //   budgets: updatedSelectedBudget,
    //   ...(selectedBudget?.goal && { goal: { ...selectedBudget.goal } }),
    //   notYetDefinedFlag: false,
    // };

    // storeBudget(finalData);
    // setBudgetData(finalData);
    // setListOfFinanceInputs([]);
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
