import * as React from "react";
import "./navigationbar.css";
import { BudgetDataType } from "../../types/BudgetDataType";
import { pageList } from "../../Constants";

interface NavigationBarPropsType {
  isLoggedIn: boolean;
  setDisplayedPage: React.Dispatch<React.SetStateAction<string>>;
  budgetData: BudgetDataType;
  setBudgetData: React.Dispatch<React.SetStateAction<BudgetDataType>>;
  displayedPage: string;
}

const NavigationBar = ({
  isLoggedIn,
  displayedPage,
  setDisplayedPage,
  budgetData,
  setBudgetData,
}: NavigationBarPropsType) => {
  const changePage = (page: string) => {
    setDisplayedPage(page);
  };

  return (
    <div className='navigation-bar'>
      <h1>Finance-App</h1>
      <div className='page-list'>
        {isLoggedIn && (
            <>
            <button onClick={() => changePage(pageList.goalsPage)}>Goals</button>
            {budgetData?.goals && (
                <button onClick={() => changePage(pageList.addFinancePage)}>
                Add finances
                </button>
            )}
            {budgetData?.goals && budgetData?.budgets && (
                <button onClick={() => changePage(pageList.budgetOverviewPage)}>
                Budget Overview
                </button>
            )}
            </>
        )}
      </div>
    </div>
  );
};
export default NavigationBar;
