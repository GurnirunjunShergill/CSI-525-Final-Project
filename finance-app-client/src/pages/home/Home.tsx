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
    setUserData: React.Dispatch<React.SetStateAction<any>>;
    userData: any;
}

const Home = ({
    setDisplayedPage,
    budgetData,
    setBudgetData,
    displayedPage,
    setUserData,
    userData,
}:displayedPagePropsType) =>{
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const pages = {
        AddFinance: <AddFinances budgetData={budgetData} setBudgetData={setBudgetData}/>,
        Goals: <Goals userData={userData} budgetData={budgetData} setBudgetData={setBudgetData}/>,
        BudgetOverview: <BudgetOverview budgetData={budgetData}/>,
        Profile: <Profile setUserData={setUserData} userData={userData}/>
    }

    return(
        <>
        <NavigationBar isLoggedIn={isLoggedIn} setDisplayedPage={setDisplayedPage} budgetData={budgetData} setBudgetData={setBudgetData} displayedPage={displayedPage}/>
        <div className='content'>
            {isLoggedIn ? pages[displayedPage as keyof typeof pages] : <Login setUserData={setUserData} setIsLoggedIn={setIsLoggedIn}/> }
        </div>
        </>
    )
}

export default Home;