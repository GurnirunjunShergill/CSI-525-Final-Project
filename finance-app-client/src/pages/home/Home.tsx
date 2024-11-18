import * as React from "react";
import { pageList } from "../../Constants";
import AddFinances from "../add-finances/AddFinances";
import { BudgetDataType } from "../../types/BudgetDataType";
import BudgetOverview from "../budget-overview/BudgetOverview";
import Goals from "../goals/Goals";
import Login from "../account-pages/login/Login";
import NavigationBar from "../../components/navigation-bar/NavigationBar";
import './home.css';

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
    const pages = {
        AddFinance: <AddFinances budgetData={budgetData} setBudgetData={setBudgetData}/>,
        Goals: <Goals budgetData={budgetData} setBudgetData={setBudgetData}/>,
        BudgetOverview: <BudgetOverview budgetData={budgetData}/>
    }

    return(
        <>
        <NavigationBar isLoggedIn={isLoggedIn} setDisplayedPage={setDisplayedPage} budgetData={budgetData} setBudgetData={setBudgetData} displayedPage={displayedPage}/>
        <div className='content'>
            {isLoggedIn ? pages[displayedPage as keyof typeof pages] : <Login setIsLoggedIn={setIsLoggedIn}/> }
        </div>
        </>
    )
}

export default Home;