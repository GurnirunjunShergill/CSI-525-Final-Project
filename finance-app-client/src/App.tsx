import * as React from "react";
import AddFinances from "./pages/add-finances/AddFinances";
import { useEffect, useState } from "react";
import BudgetOverview from "./pages/budget-overview/BudgetOverview";
import { getBudget } from "./helper/storageHelper";
import { BudgetDataType } from "./types/BudgetDataType";
import Home from "./pages/home/Home";
import {pageList} from './Constants';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const App = () =>{
    const [userData, setUserData] = useState({});
    const [budgetData, setBudgetData] = useState<BudgetDataType>()
    const [displayedPage, setDisplayedPage] = useState<string>(pageList.homePage);

    const signIn = async ()=>{
        await signInWithEmailAndPassword(auth, 'gurnirunjun.shergill@gmail.com', 'rootpassword')
    };
    useEffect(()=>{
        signIn();
    },[])

    useEffect(()=>{
        const existingBudget: BudgetDataType = getBudget()
        if(existingBudget) setBudgetData(existingBudget)
        else setBudgetData({notYetDefinedFlag: true})
    },[])

    return(
        <>
            {/* <GoogleOAuthProvider clientId="650685810723-l19l4n0ur2o51r3kb879e86gk7bm0d1k.apps.googleusercontent.com"> */}
                <Home setUserData={setUserData} setDisplayedPage={setDisplayedPage} displayedPage={displayedPage} budgetData={budgetData} setBudgetData={setBudgetData}/>
            {/* </GoogleOAuthProvider> */}
        </>
    )
}

export default App;