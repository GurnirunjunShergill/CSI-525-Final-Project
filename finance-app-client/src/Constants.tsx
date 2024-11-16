export const pageList = {
    addFinancePage: 'AddFinance',
    budgetOverviewPage: 'BudgetOverview',
    goalsPage: 'Goals',
    homePage: 'home-page'
}

export const monthList:{[key: string]: {name: string; lastDayOfMonth: number; leapYear?:number;}} = {
    '01': {
        name: 'January',
        lastDayOfMonth: 31
    },
    '02': {
        name: 'February',
        lastDayOfMonth: 28,
        leapYear: 29
    },
    '03': {
        name: 'March',
        lastDayOfMonth: 31
    },
    '04': {
        name: 'April',
        lastDayOfMonth: 31
    },
    '05': {
        name: 'May',
        lastDayOfMonth: 31
    },
    '06': {
        name: 'June',
        lastDayOfMonth: 31
    },
    '07': {
        name: 'July',
        lastDayOfMonth: 31
    },
    '08': {
        name: 'August',
        lastDayOfMonth: 31
    },
    '09': {
        name: 'September',
        lastDayOfMonth: 31
    },
    '10': {
        name: 'October',
        lastDayOfMonth: 31
    },
    '11': {
        name: 'November',
        lastDayOfMonth: 31
    },
    '12': {
        name: 'December',
        lastDayOfMonth: 31
    }
}

export const dayList:{[key: string]: string} = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
}