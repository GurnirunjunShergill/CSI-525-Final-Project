import * as React from "react";
import { useState } from "react";
import { getDate } from "../../helper/dataHelper";
import './addfinances.css';
import { auth } from "../../firebase";

const AddFinances = ({ selectedBudget, budgetData, setBudgetData, userData, selectedBudgetIndex, allBudgets }: any) => {
  const defaultBudgetItemValue = {
    budgetItemName: "",
    budgetItemType: "food (groceries)",
    budgetItemAmount: 0,
  };
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
    let updatedSelectedBudget = selectedBudget
    const budgetDateIndex = findDateBudgetIndex(
      selectedBudget,
      budgetDate
    );

    if(budgetDateIndex > -1){
      updatedSelectedBudget.budgets[budgetDateIndex] = 
      {
        date: budgetDate,
        budget: listOfFinanceInputs
      }
    }else{
      updatedSelectedBudget.budgets = [
        ...updatedSelectedBudget.budgets,
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
      body: JSON.stringify({ email: userData.email, budgetDataToUpdate: updatedBudget[selectedBudgetIndex], budgetName: selectedBudget['budget-name'] }),
    });

    if(response.status === 200){
      const data = await response.json();
      console.log('data', data)
      setBudgetData(data.budgetData)
    }
  };

  const deleteBudgetItem = (event:any, indexToBeRemoved:number) =>{
    event.preventDefault();
    setListOfFinanceInputs((prevItems) => prevItems.filter((_,index) => index !== indexToBeRemoved));
  }
  console.log(listOfFinanceInputs)

  return (
    <div className='add-finances'>
      <form>
        <label>Date of Entry</label>
        <input type="date" onChange={updateBudgetDate} />
        {listOfFinanceInputs.map((item, index) => {
          const {budgetItemName, budgetItemType, budgetItemAmount} = item;
          console.log(budgetItemName, budgetItemType, budgetItemAmount)
          return (
            <div className='add-finance-item' id={`${index}`} key={index}>
              <label>Budget Item Name</label>
              <input
                value={budgetItemName}
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
                value={budgetItemType}
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
                value={budgetItemAmount}
                type="number"
                onChange={() =>
                  updateBudgetItem({
                    event,
                    index,
                    valueToBeUpdated: "budgetItemAmount",
                  })
                }
              />
              <button onClick={(event:any)=>deleteBudgetItem(event,index)}>delete item</button>
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
