const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors());

const admin = require("firebase-admin");
const serviceAccount = require("./budge-it-a9209-firebase-adminsdk-4ygk8-350f2634ee.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'budge-it-a9209.firebaseio.com',
  });
}
const database = admin.firestore();

const verifyIdToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  
  console.log('Received token:', idToken);  // Check if the token is correctly passed
  
  if (!idToken) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;  // Store decoded token in request object (optional)
    next();
  } catch (error) {
    console.error('Token verification failed:', error);  // Log the error
    return res.status(401).json({ error: 'Unauthorized, invalid token' });
  }
};

// *** User *** //

const getUser = async () => {
  const collection = database.collection('database');
  const userData = await collection.doc('user').get();
  return userData;
}

const login = async (email, password) =>{
  const existingUserData = await getUser();
  const { users } = await existingUserData.data();
  const userIndex = users.findIndex((user)=>user.email === email && user.password === password);
  if(userIndex > -1) return {isLoggedIn: true, userIndex: userIndex, username: users[userIndex].username}
  else return {isLoggedIn: false, userIndex: undefined, username: undefined};
}

const addUser = async (dataToBeAdded, replaceData = false) => {
  const existingUserData = await getUser();
  const collection = database.collection('database');
  const { users } = existingUserData.data();
  if (users.length > 0 && !replaceData)
    await collection.doc('user').set(
      {
        users: [...users, ...dataToBeAdded]
      }
    );
  else await collection.doc('user').set(
    {
      users: [...dataToBeAdded]
    }
  );
}

const deleteUser = async (email) => {
  const existingUserData = await getUser();
  const { users } = existingUserData.data();
  if (users) {
    const updatedUsersWithDeletedUserRemoved = users.filter(user => user.email !== email)
    await addUser(updatedUsersWithDeletedUserRemoved, true)
  }
}

const updateUser = async (email, updatedUserData) => {
  const existingUserData = await getUser();
  const { users } = existingUserData.data();
  if (users) {
    const usersCopy = users;
    const userIndexToBeUpdated = users.findIndex((user) => user.email === email);
    usersCopy[userIndexToBeUpdated] = { ...usersCopy[userIndexToBeUpdated], ...updatedUserData }
    await addUser(usersCopy, true)
    return true;
  }
  return false;
}

app.post('/', verifyIdToken, async (req, res) => {
  console.log('here')
  // await addUser([{
  //   email: 'gurnirunjun.shergill@gmail.com',
  //   password: 'root',
  //   username: 'gurni'
  // }]);
  // const userData = await getUser();
  // const user = userData.data();
  // await deleteUser('gurnirunjun.shergill1@gmail.com')
  // if (!userData.exists) {
  //   console.log('No such document!');
  // } else {
  //   console.log('Document data:', userData.data());
  // }
  // await updateUser('gurnirunjun.shergill@gmail.com', {username: 'gurn'})
  // const [budgetIndex, budget] = await getBudget('gurnirunjun.shergill@gmail.com', 'test adding new budget');
  // if(budget){
  //   console.log('budget data', budget)
  // }else console.log('could not be found');

  // await addGoal('gurnirunjun.shergill@gmail.com', {
  //   'daily-budget': 25,
  //   'monthly-budget': 500,
  //   'yearly-budget': 8000,
  //   'weekly-budget': 100,
  // }, 'test adding new budget')
  // const collection = database.collection('database');
  // const userData = collection.doc('user');  
  // console.log(await userData.get());
  
  // res.send(req.body)
})

app.post('/login', verifyIdToken, async (req, res) => {
  const {email, password} = req.body;
  const {isLoggedIn, userIndex, username} = await login(email, password);
  return isLoggedIn ? res.status(200).json({message: 'all done you did it', username: username}) : res.status(400).json({message: 'not logged in'})
})

app.post('/add-user', async (req, res) => {
  const {email, password, username} = req.body;
  await addUser([{email: email, username: username, password: password }]);
  return res.status(200).json({message: 'user added'});
})

app.post('/update-user', async(req, res) => {
  const {email, username, password} = req.body;
  const successful = await updateUser(email, {username: username, password: password})
  return successful ? res.status(200).json({message: 'profile updated'}) : res.status(400).json({message: 'could not find user with that email'});
})

app.post('/delete-user', async (req, res) => {
  const {email} = req.body;
  await deleteUser(email)
  return res.status(200).json({message: 'user deleted'});
})


// *** Budget *** //

const getAllBudgets = async () =>{
  const collection = database.collection('database');
  const existingBudgets = await collection.doc('budget').get();
  return existingBudgets;
}

const getBudget = async (email, budgetName) => {
  // get database data
  const collection = database.collection('database');
  // get user data
  const userData = await collection.doc('user').get();
  const { users } = userData.data();
  // find the specific user based on the email passed in
  const userIndex = users.findIndex((user) => user.email === email);
  // if user exists
  if (userIndex > -1) {
    const user = users[userIndex];
    // get budget data
    const budgetData = await collection.doc('budget').get();
    const { budgets } = budgetData.data();
    // get the list of budgets associated with the user
    const listOfBudgets = budgets.filter((budget) => 
      (budget.users.owner === user.email) || (budget['write-access']?.includes(email))
    )

    // find the specific budget from the above list based on the name passed in
    const budgetIndex = listOfBudgets.findIndex((budget) => budget['budget-name'] === budgetName);
    // if that budget exists
    if (budgetIndex > -1) {
      // return the budget index and the budget itself
      return [budgetIndex, budgets[budgetIndex]];
      // else the budget does not exist
    } return ['budget not found'];
    // else the user does not have any budgets
  }  return ['user does not have any budgets'];
}

const addBudget = async (budgetData) =>{
  const existingBudgets = await getAllBudgets();
  const {budgets} = existingBudgets.data();
  await collection.doc('budget').set(
    {
      budgets: [...budgets, budgetData]
    }
  );
}

const updateBudget = async(budgetData, budgetIndex) =>{
  const collection = database.collection('database');
  const existingBudgets = await collection.doc('budget').get();
  const {budgets} = existingBudgets.data();
  let updatedBudget = budgets;
  updatedBudget[budgetIndex] = budgetData;
  await collection.doc('budget').set(
    {
      budgets: updatedBudget
    }
  );
}

const addGoal = async ({email, goalData, budgetName}) => {
  const existingUserData = await getUser();
  const {users} = existingUserData.data();
  const userIndex = users.findIndex((user) => user.email === email);

  if(userIndex > -1){
    console.log('made it inside the if statement')
    const user = users[userIndex];
    addBudget({
      goal: {...goalData},
      // 'budget-items': {
      //   'budget-item-date': 'November 17, 2024 at 12:00:00 AM UTC-5',
      //   'budget-item-name': '',
      //   'budget-item-amount': 0,
      // },
      // 'budget-item-totals':{
      //   'budget-item-daily-total': 0,
      //   'budget-item-monthly-total': 0,
      //   'budget-item-yearly-total': 0,
      //   'budget-item-weekly-total': 0,
      // },
      'budget-name': budgetName,
      users:{
        owner: user.email,
        'read-access': [''],
        'write-access': [email]
      }
    })
  }
}

const updateGoal = async (email, goalData, budgetName) => {
  const existingUserData = await getUser();
  const {users} = existingUserData.data();
  const userIndex = users.findIndex((user)=>user.email === email)
  if(userIndex > -1){
    const [budgetIndex, budget] = await getBudget(email,budgetName);
    let updatedBudget = {...budget, goal: {...goalData}}
    updateBudget(updatedBudget, budgetIndex)
  }
}

const addToExistingBudget = async ({email, budgetData, budgetName}) =>{
  const [budgetIndex, budget] = await getBudget(email,budgetName);
  // you have the actual budget data in the database
  // you have the updated budget data
  // you need to combine them and then add them to the database
  const updatedBudget = {budget, ...budgetData}
  const existingBudgets = await getAllBudgets();
  const {budgets} = existingBudgets.data();
  // we need to replace the index of the budget with the updated budget data
    budgets[budgetIndex] = updatedBudget
    // and then we need to update the database with the new budget
  await collection.doc('budget').set(
    {
      budgets: [...budgets]
    }
  );

}

app.post('/add-goal', async (req, res) => {
  const {email, budgetData, budgetName} = req.body;
  await addGoal({email: email, goalData: budgetData, budgetName: budgetName});
  return res.status(200).json({message: 'goal added'});
})

app.post('/add-budget', async (req, res) => {
  const {email, budgetData, budgetName} = req.body;
  await addToExistingBudget({email: email, goalData: budgetData, budgetName: budgetName});
  return res.status(200).json({message: 'budget added'});
})

app.put('/update-user', (req, res) => {
  res.send('Got a PUT request at /user')
})

// app.delete('/delete-user', async (req, res) => {
//   await deleteUser('gurnirunjun.shergill1@gmail.com')
//   res.send('Got a DELETE request at /user')
// })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

