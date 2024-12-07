import * as React from "react";
import { useState } from "react";
import { pageList } from "../../Constants";
import { auth } from "../../firebase";

const BudgetOverview = ({
  budgetData,
  selectedBudget,
  setSelectedBudget,
  setDisplayedPage,
  setSelectedBudgetIndex,
  userData,
  selectedBudgetIndex,
  setBudgetData
}: any) => {
  const [editGoals, setEditGoals] = useState(false);
  const [editBudgetTitle, setEditBudgetTitle] = useState(false);
  const [goalData, setGoalData] = useState<any>();
  const [budgetTitle, setBudgetTitle] = useState();
  const [isUserSelectedBudgetOwner, setIsUserSelectedBudgetOwner] = useState(false);

  const selectBudget = (budgetName: string) => {
    const filterToBudget = budgetData.filter(
      (budget: any) => budget?.["budget-name"] === budgetName
    );
    const filteredBudgetIndex = budgetData.findIndex((budget: any) => 
      budget?.["budget-name"] === budgetName
    );
    setSelectedBudget(filterToBudget[0]);
    setSelectedBudgetIndex(filteredBudgetIndex);
  };
  React.useEffect(()=>{
    if(selectedBudget){
        setGoalData(selectedBudget.goal)
        setBudgetTitle(selectedBudget.budgetTitle)
        if(selectedBudget.users.owner === userData.email) setIsUserSelectedBudgetOwner(true);
    }
  },[selectedBudget])

  const updateBudgetTitle = async(event:any)=>{
    event.preventDefault();
    const token = await auth.currentUser.getIdToken();

    let updatedBudget = budgetData;
    updatedBudget[selectedBudgetIndex]['budget-name'] = budgetTitle;

    const response = await fetch("http://localhost:3000/edit-budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({budgetData: updatedBudget}),
      });
      if(response.status === 200){
        const data = await response.json();
        console.log('data', data)
        setBudgetData(data.budgetData)
      }
      setEditBudgetTitle(false);
  }

  const updateGoals = async(event:any) =>{
    event.preventDefault();
    const token = await auth.currentUser.getIdToken();
    let updatedBudget = budgetData;
    updatedBudget[selectedBudgetIndex].goal = {...goalData};

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
        console.log('data', data)
        setBudgetData(data.budgetData)
      }

    setEditGoals(false);
  }

  return (
    <>
      {budgetData?.map((budget: any, index: number) => {
        return (
          <div key={index}>
            <button
              onClick={() => {
                selectBudget(budget?.["budget-name"]);
              }}
            >
              <p>{budget?.["budget-name"]}</p>
            </button>
          </div>
        );
      })}
      {selectedBudget && (
        <div>
            {isUserSelectedBudgetOwner && editBudgetTitle ? (
                <form>
                    <input value={budgetTitle} onChange={(event:any)=>{setBudgetTitle(event.target.value)}} />
                    <input onClick={updateBudgetTitle} type='submit'/>
                </form>
            ):
            (
                <>
                    <h3>{selectedBudget?.["budget-name"]} </h3>
                    {isUserSelectedBudgetOwner && <button onClick={()=>{setEditBudgetTitle(true)}}>edit budget title</button>}
                </>
            )}
          
          {editGoals && goalData ? (
            <form>
                <input value={goalData["daily-budget"]} onChange={(event:any)=>{
                    setGoalData({
                        ...goalData,
                        "daily-budget": event.target.value
                    });
                    }} />
                <input value={goalData["weekly-budget"]} onChange={(event:any)=>{
                    setGoalData({
                        ...goalData,
                        "weekly-budget": event.target.value
                    });
                    }} />
                <input value={goalData["monthly-budget"]} onChange={(event:any)=>{
                    setGoalData({
                        ...goalData,
                        "monthly-budget": event.target.value
                    });
                    }} />
                <input value={goalData["yearly-budget"]} onChange={(event:any)=>{
                    setGoalData({
                        ...goalData,
                        "yearly-budget": event.target.value
                    });
                    }} />
                <input onClick={updateGoals} type='submit' />
            </form>
          ) : (
            <>
                <ul>
                <li>daily goal: {selectedBudget?.goal?.["daily-budget"]}</li>
                <li>weekly goal: {selectedBudget?.goal?.["weekly-budget"]}</li>
                <li>monthly goal: {selectedBudget?.goal?.["monthly-budget"]}</li>
                <li>yearly goal: {selectedBudget?.goal?.["yearly-budget"]}</li>
                </ul>
                {isUserSelectedBudgetOwner && <button onClick={()=>{setEditGoals(true)}}>edit goals</button>}
            </>
          )}

          {selectedBudget?.["budget-item-totals"] && (
            <ul>
              <li>
                daily budget total:{" "}
                {selectedBudget?.goal?.["budget-item-daily-total"]}
              </li>
              <li>
                weekly budget total:{" "}
                {selectedBudget?.goal?.["budget-item-weekly-total"]}
              </li>
              <li>
                monthly budget total:{" "}
                {selectedBudget?.goal?.["budget-item-monthly-total"]}
              </li>
              <li>
                yearly budget total:{" "}
                {selectedBudget?.goal?.["budget-item-yearly-total"]}
              </li>
            </ul>
          )}
          {selectedBudget?.budgets &&
            selectedBudget?.budgets?.map((budgetItem: any, index: number) => {
              return (
                <div key={index}>
                  <p>{budgetItem?.date}</p>
                  {budgetItem?.budget?.map((item: any, index: number) => {
                    return (
                      <ul key={index}>
                        <li>{item?.budgetItemAmount}</li>
                        <li>{item?.budgetItemName}</li>
                        <li>{item?.budgetItemType}</li>
                      </ul>
                    );
                  })}
                </div>
              );
            })}
          {isUserSelectedBudgetOwner && <button onClick={() => setDisplayedPage(pageList.addFinancePage)}>
            add/edit/delete budget items
          </button>}
        </div>
      )}
    </>
  );
};

export default BudgetOverview;
