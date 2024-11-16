import * as React from "react";
import { pageList } from "../../Constants";
import AddFinances from "../add-finances/AddFinances";
import { BudgetDataType } from "../../types/BudgetDataType";
import BudgetOverview from "../budget-overview/BudgetOverview";
import Goals from "../goals/Goals";
import Login from "../account-pages/login/Login";


// home page should include 
// add finance tab
// overview tab
// goal tab
// general tab
    // should include 

interface displayedPagePropsType {
    setDisplayedPage: React.Dispatch<React.SetStateAction<string>>;
    budgetData: BudgetDataType;
    setBudgetData: React.Dispatch<React.SetStateAction<BudgetDataType>>;
    displayedPage: string;
}

const Home = ({
    setDisplayedPage,
    budgetData,
    setBudgetData,
    displayedPage
}:displayedPagePropsType) =>{
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const changePage = (page:string) =>{
        setDisplayedPage(page)
    }
    const pages = {
        AddFinance: <AddFinances budgetData={budgetData} setBudgetData={setBudgetData}/>,
        Goals: <Goals budgetData={budgetData} setBudgetData={setBudgetData}/>,
        BudgetOverview: <BudgetOverview budgetData={budgetData}/>
    }

    return(
        <>
        { isLoggedIn ? <div>
            <button onClick={()=>changePage(pageList.goalsPage)}>
                Goals
            </button>
            {budgetData?.goals &&  <button onClick={()=>changePage(pageList.addFinancePage)}>
                Add finances
            </button>}
            {budgetData?.goals && budgetData?.budgets &&  <button onClick={()=>changePage(pageList.budgetOverviewPage)}>
                Budget Overview
            </button>}
        </div>
        :<Login setIsLoggedIn={setIsLoggedIn}/> 
        }
        {isLoggedIn && pages[displayedPage as keyof typeof pages]}
        </>
    )
}

export default Home;