import * as React from "react";
import { BudgetDataType } from "../../types/BudgetDataType";
import { storeBudget } from "../../helper/storageHelper";
import Input from "../../components/input/Input";
import styles from './Goals.module.css';
import { auth } from "../../firebase";

interface GoalsPropsType {
    budgetData: BudgetDataType;
    setBudgetData: React.Dispatch<React.SetStateAction<BudgetDataType>>;
    userData: any
}

const Goals = ({
    budgetData,
    setBudgetData,
    userData,
}:GoalsPropsType) =>{
    const [dailyBudget, setDailyBudget] = React.useState(-1);
    const [weeklyBudget, setWeeklyBudget] = React.useState(-1);
    const [monthlyBudget, setMonthlyBudget] = React.useState(-1);
    const [yearlyBudget, setYearlyBudget] = React.useState(-1);
    const [budgetName, setBudgetName] = React.useState('');

    const updateGoals = async(event:any) => {
        event.preventDefault();
        const token = await auth.currentUser.getIdToken();

        const response = await fetch("http://localhost:3000/add-goal", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                email: userData.email,
                budgetData:{
                'daily-budget': dailyBudget,
                'weekly-budget': weeklyBudget,
                'monthly-budget': monthlyBudget,
                'yearly-budget': yearlyBudget,
                },
                budgetName: budgetName,
            }),
          });
      
          if(response.status === 200){
            const data = await response.json();
            console.log(data)
          }else if(response.status === 400){
            const data = await response.json();
            console.log(response, data)
            console.log('login failed handle that here')
          }

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
            <label>budget name</label>
            <input onChange={(event)=>{setBudgetName(event.target.value)}} type='text'/>
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