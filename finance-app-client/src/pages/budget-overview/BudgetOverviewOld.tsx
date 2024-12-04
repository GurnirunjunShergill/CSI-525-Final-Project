import * as React from "react";
import { sortBudgetsByDate } from "../../helper/dataHelper";
import { BudgetDataType, BudgetListType } from "../../types/BudgetDataType";
import { useState } from "react";

const BudgetOverview = ({budgetData}:{budgetData:BudgetDataType}) =>{
    // get sorted data by date
    const {todaysIndex, sortedBudgetList} = sortBudgetsByDate(budgetData);
    
    console.log('this is the sorted budget list', todaysIndex);
    const [currentTableIndex, setCurrentTableIndex] = useState<number>(todaysIndex === -1 ? 0 : todaysIndex);
    const [tableIndexError, setTableIndexError] = useState<string>('');
    const updateTableIndexDate = (direction:'up'|'down') =>{
        if(currentTableIndex === 0 && direction === 'down'){
            // TODO: better wording
            setTableIndexError('can not go to a more previous date');
            return;
        }
        if(currentTableIndex === (sortedBudgetList.budgets.length-1) && direction === 'up'){
            // TODO: better wording
            setTableIndexError('can not go to a more further date');
            return;
        }
        if(direction==='up') setCurrentTableIndex(currentTableIndex + 1);
        if(direction==='down') setCurrentTableIndex(currentTableIndex - 1);
        setTableIndexError('');
    }
// organize by date
// every day entry has a key
// there is groupings for:
// group by day
//  have pagination for grouping by day
//  have a sorting function by day where default is today's date (or closest to today's date with the tie breaker being yesterday)
// - week
    // - total for week
// - month
    // - total for month
// - year
    // - total for year
    return(
        <>
            <table>
                <thead>
                <tr>
                    <th>Budget Overview By Day</th>
                </tr>
                <tr><td>{sortedBudgetList.budgets[currentTableIndex].budgetDate}</td></tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Budget Item Name</td>
                        <td>Budget Item Type</td>
                        <td>Budget Item Amount</td>
                    </tr>
                   
                    {sortedBudgetList.budgets[currentTableIndex]?.budget?.map((budgetRow:BudgetListType, index:number)=>{
                        return(
                            <tr key={index}>
                                <td>{budgetRow?.budgetItemName}</td>
                                <td>{budgetRow?.budgetItemType}</td>
                                <td>{budgetRow?.budgetItemAmount}</td>
                            </tr>
                            
                        )
                    })}
                    <tr>
                        <td>total</td>
                        <td>{sortedBudgetList.budgets[currentTableIndex]?.budgetTotal}</td>
                    </tr>
                    <tr>
                        <td><button onClick={()=>updateTableIndexDate('down')}>{'<'}</button><button onClick={()=>updateTableIndexDate('up')}>{'>'}</button></td>
                        <td>{tableIndexError && tableIndexError}</td>
                    </tr>
                    
                </tbody>
                
            </table>

            {/* weekly view */}
            
            
        </>
    )
}

export default BudgetOverview;