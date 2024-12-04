import * as React from "react";
import "./navigationbar.css";
import { pageList } from "../../Constants";

interface NavigationBarPropsType {
  isLoggedIn: boolean;
  setDisplayedPage: React.Dispatch<React.SetStateAction<string>>;
  budgetData: any;
  setBudgetData: any;
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
    <div className="navigation-bar">
      <div className="navigation-bar-left-content">
        <h1>Finance-App</h1>
        <div className="page-list">
          {isLoggedIn && (
            <>
              {budgetData && (
                <>
                  {/* <button onClick={() => changePage(pageList.addFinancePage)}>
                  Add finances
                </button> */}
                  <button
                    onClick={() => changePage(pageList.budgetOverviewPage)}
                  >
                    Budget Overview
                  </button>
                </>
              )}
              <button onClick={() => changePage(pageList.goalsPage)}>
                Add Budget
              </button>

              {/* {budgetData?.goals && budgetData?.budgets && (
                <button onClick={() => changePage(pageList.budgetOverviewPage)}>
                  Budget Overview
                </button>
              )} */}
            </>
          )}
        </div>
      </div>
      {isLoggedIn && (
        <div>
          <button
            onClick={() => setDisplayedPage(pageList.profilePage)}
            className="profile-button"
          >
            Profile
          </button>
          <button onClick={() => {}} className="profile-button">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
export default NavigationBar;
