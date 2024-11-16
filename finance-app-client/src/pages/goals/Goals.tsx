import * as React from "react";
import { BudgetDataType } from "../../types/BudgetDataType";
import { storeBudget } from "../../helper/storageHelper";
import Input from "../../components/input/Input";
import styles from './Goals.module.css';

interface GoalsPropsType {
    budgetData: BudgetDataType;
    setBudgetData: React.Dispatch<React.SetStateAction<BudgetDataType>>;
}

const Goals = ({
    budgetData,
    setBudgetData
}:GoalsPropsType) =>{
    const [dailyBudget, setDailyBudget] = React.useState(-1);
    const [weeklyBudget, setWeeklyBudget] = React.useState(-1);
    const [monthlyBudget, setMonthlyBudget] = React.useState(-1);
    const [yearlyBudget, setYearlyBudget] = React.useState(-1);

    const updateGoals = (event:any) => {
        event.preventDefault();
        const updatedBudgetData = {
            budgets: budgetData.budgets,
            // only adds goals if submitted in the form
            goals: {
                ...(dailyBudget !== -1 && {dailyBudget: dailyBudget}),
                ...(weeklyBudget !== -1 && {weeklyBudget: weeklyBudget}),
                ...(monthlyBudget !== -1 && {monthlyBudget: monthlyBudget}),
                ...(yearlyBudget !== -1 && {yearlyBudget: yearlyBudget}),
            },
            notYetDefinedFlag: budgetData.notYetDefinedFlag
        }

        setBudgetData(updatedBudgetData);
        storeBudget(updatedBudgetData);
    }

    return(
        <form className={styles['form-container']}>
            <div className={styles['form-container-item']}>
                <Input label={'Daily Budget'} defaultValue={''} onChange={(event:any)=>{setDailyBudget(Number(event.target.value))}}/>
                <Input label={'Weekly Budget'} defaultValue={''} onChange={(event:any)=>{setWeeklyBudget(Number(event.target.value))}}/>
            </div>
            <div className={styles['form-container-item']}>
                <Input label={'Monthly Budget'} defaultValue={''} onChange={(event:any)=>{setMonthlyBudget(Number(event.target.value))}}/>
                <Input label={'Yearly Budget'} defaultValue={''} onChange={(event:any)=>{setYearlyBudget(Number(event.target.value))}}/>
            </div>
            <button onClick={updateGoals}>submit</button>
        </form>
    )
}

export default Goals;