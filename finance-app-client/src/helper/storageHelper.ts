const BUDGET_DATA_SESSION_STORAGE = 'budget-data'

export const storeBudget = (dataToBeStored:any) =>{
    if(window.sessionStorage.getItem(BUDGET_DATA_SESSION_STORAGE)){
        const currentData = JSON.parse(window.sessionStorage.getItem(BUDGET_DATA_SESSION_STORAGE));
        const updatedDataToBeStored = JSON.stringify({...currentData, ...dataToBeStored});
        window.sessionStorage.setItem(BUDGET_DATA_SESSION_STORAGE, updatedDataToBeStored);
    }else window.sessionStorage.setItem(BUDGET_DATA_SESSION_STORAGE, JSON.stringify(dataToBeStored));
}

export const getBudget = () =>{
    return JSON.parse(window.sessionStorage.getItem(BUDGET_DATA_SESSION_STORAGE))
}