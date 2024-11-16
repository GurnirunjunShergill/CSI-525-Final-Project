import { dayList, monthList } from "../Constants";
import { BudgetDataType, BudgetItemType } from "../types/BudgetDataType"

export const sortBudgetsByDate = (budgetData:BudgetDataType) =>{
    const date = new Date();
    const currentDate = `${date.getUTCFullYear()}-${date.getUTCMonth() < 10 ? '0' + (date.getUTCMonth()+1) : (date.getUTCMonth()+1)}-${date.getUTCDate()}`
    budgetData.budgets.sort((firstDate:BudgetItemType, secondDate:BudgetItemType) =>{
        return firstDate.budgetDate.localeCompare(secondDate.budgetDate);
    })
    const currentIndexForTodaysDate = budgetData.budgets.map((budgetItem:any) => budgetItem.budgetDate).indexOf(currentDate)
    return {sortedBudgetList: budgetData, todaysIndex: currentIndexForTodaysDate}
}

export const getDate = (date:'today' | string) =>{
    return date === 'today' ? new Date().toISOString().split('T')[0] : new Date(date).toISOString().split('T')[0];
}

export const getMonthLastDayOfMonth = (date:string) => {
    const monthAsNumber = date.substring(5,7);
    const year = date.substring(0,4);
    console.log('made it here', date, year)
    if(monthAsNumber === '02' && (Number(year) % 4 === 0 || year.slice(-2) === '00')){
        return monthList['02'].leapYear;
    }else return monthList[monthAsNumber].lastDayOfMonth;
}

export const getWeek = (date:string)=>{
    const formattedDate = new Date(date)
    const monthAsNumber = date.substring(5,7);
    const currentDate = date.slice(-2).includes('-') ? date.slice(-1) : date.slice(-2);
    const currentDay = formattedDate.getUTCDay();
    if (dayList[currentDay].toLowerCase() !== 'sunday'){
        return Number(currentDate) > 5 ? 
                `${monthAsNumber}-c${(Number(currentDate) - currentDay).toString()}`
            :(
                getMonthLastDayOfMonth(`${date.substring(0,4)}-${(Number(date.substring(5,7)) - 1) < 10 ? '0' + (Number(date.substring(5,7)) - 1).toString() : Number(date.substring(5,7)) - 1 }-${date.slice(-2)}`) - (5 - Number(currentDate))
            )
    }
    else return `${monthAsNumber}-c${currentDate}`;
}