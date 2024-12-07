import * as React from "react";
import { pageList } from "../../Constants";
import AddFinances from "../add-finances/AddFinances";
import { BudgetDataType } from "../../types/BudgetDataType";
import BudgetOverview from "../budget-overview/BudgetOverview";
import Goals from "../goals/Goals";
import Login from "../account-pages/login/Login";
import NavigationBar from "../../components/navigation-bar/NavigationBar";
import './home.css';
import Profile from "../account-pages/profile/Profile";
import { useState } from "react";

interface displayedPagePropsType {
    setDisplayedPage: React.Dispatch<React.SetStateAction<string>>;
    displayedPage: string;
    setUserData: React.Dispatch<React.SetStateAction<any>>;
    userData: any;
}

const Home = ({
    setDisplayedPage,
    displayedPage,
    setUserData,
    userData,
}:displayedPagePropsType) =>{
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [budgetData, setBudgetData] = useState<any>()
    const [selectedBudget, setSelectedBudget] = useState();
    const [selectedBudgetIndex, setSelectedBudgetIndex] = useState();

    const pages = {
        AddFinance: <AddFinances selectedBudgetIndex={selectedBudgetIndex} budgetData={budgetData} setBudgetData={setBudgetData} userData={userData} selectedBudget={selectedBudget} setSelectedBudget={setSelectedBudget}/>,
        Goals: <Goals userData={userData} budgetData={budgetData} setBudgetData={setBudgetData}/>,
        BudgetOverview: <BudgetOverview setBudgetData={setBudgetData} selectedBudgetIndex={selectedBudgetIndex} setSelectedBudgetIndex={setSelectedBudgetIndex} setDisplayedPage={setDisplayedPage} budgetData={budgetData} setSelectedBudget={setSelectedBudget} selectedBudget={selectedBudget} userData={userData}/>,
        Profile: <Profile setUserData={setUserData} userData={userData}/>
    }

    return(
        <>
        <NavigationBar isLoggedIn={isLoggedIn} setDisplayedPage={setDisplayedPage} budgetData={budgetData} setBudgetData={setBudgetData} displayedPage={displayedPage}/>
        <div className='content'>
            {isLoggedIn ? pages[displayedPage as keyof typeof pages] : <Login setUserData={setUserData} setIsLoggedIn={setIsLoggedIn} setBudgetData={setBudgetData} budgetData={budgetData}/> }
        </div>
        </>
    )
}

export default Home;