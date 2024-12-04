import * as React from "react";
import { useState } from "react";
import { pageList } from "../../Constants";

const BudgetOverview = ({budgetData, selectedBudget, setSelectedBudget, setDisplayedPage, setSelectedBudgetIndex}:any) =>{

    const selectBudget = (budgetName:string) =>{
        const filterToBudget = budgetData.filter((budget:any)=> budget?.['budget-name'] === budgetName)
        const filteredBudgetIndex = budgetData.findIndex((budget:any)=>{budget?.['budget-name'] === budgetName})
        setSelectedBudget(filterToBudget[0]);
        setSelectedBudgetIndex(filteredBudgetIndex)
    }

    console.log(selectedBudget?.budgets)

    return(
        <>
            {budgetData?.map((budget:any, index:number)=>{
                return (
                    <div key={index}>
                        <button onClick={()=>{selectBudget(budget?.['budget-name'])}}>
                            <p>{budget?.['budget-name']}</p>
                        </button>
                    </div>
                )
            })}
            {selectedBudget && (
                <div>
                    <h3>{selectedBudget?.['budget-name']} </h3>
                    <ul>
                        <li>daily goal: {selectedBudget?.goal?.['daily-budget']}</li>
                        <li>weekly goal: {selectedBudget?.goal?.['weekly-budget']}</li>
                        <li>monthly goal: {selectedBudget?.goal?.['monthly-budget']}</li>
                        <li>yearly goal: {selectedBudget?.goal?.['yearly-budget']}</li>
                    </ul>
                    {selectedBudget?.['budget-item-totals'] && (
                        <ul>
                            <li>daily budget total: {selectedBudget?.goal?.['budget-item-daily-total']}</li>
                            <li>weekly budget total: {selectedBudget?.goal?.['budget-item-weekly-total']}</li>
                            <li>monthly budget total: {selectedBudget?.goal?.['budget-item-monthly-total']}</li>
                            <li>yearly budget total: {selectedBudget?.goal?.['budget-item-yearly-total']}</li>
                        </ul>
                    )}
                    {selectedBudget?.budgets && (
                        selectedBudget?.budgets?.map((budgetItem:any, index:number)=>{
                            return (
                                <div key={index}>
                                    <p>{budgetItem?.date}</p>
                                    {budgetItem?.budget?.map((item:any, index:number)=>{
                                        console.log(item)
                                        return(
                                            <ul key={index}>
                                                <li>{item?.budgetItemAmount}</li>
                                                <li>{item?.budgetItemName}</li>
                                                <li>{item?.budgetItemType}</li>
                                            </ul>
                                        )
                                    })}
                                </div>
                            )
                        })
                    )}
                    <button onClick={() => setDisplayedPage(pageList.addFinancePage)}>add budget items</button>
                </div>
            )}

        </>
    )
}

export default BudgetOverview;