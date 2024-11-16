const express = require('express')
const app = express()
const port = 3000
// const {getUser, addUser} = require('./databaseOperations');

var admin = require("firebase-admin");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, getDoc } = require("firebase-admin/firestore");
var serviceAccount = require("./budge-it-a9209-firebase-adminsdk-4ygk8-a417654b31.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'budge-it-a9209.firebaseio.com'
});
const database = getFirestore();

const getUser = async () => {
  const collection = database.collection('database');
  const userData = await collection.doc('user').get();
  return userData;
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

const deleteUser = async (email) =>{
  const existingUserData = await getUser();
  const { users } = existingUserData.data();
  if(users){
    const updatedUsersWithDeletedUserRemoved = users.filter(user=> user.email !== email)
    await addUser(updatedUsersWithDeletedUserRemoved, true)
  }
}

const updateUser = async (email, updatedUserData)=>{
  const existingUserData = await getUser();
  const { users } = existingUserData.data();
  if(users){
    const usersCopy = users;
    const userIndexToBeUpdated = users.findIndex((user) => user.email === email);
    usersCopy[userIndexToBeUpdated] = {...usersCopy[userIndexToBeUpdated], ...updatedUserData}
    await addUser(usersCopy, true)
  }
}



app.get('/', async (req, res) => {
  // await addUser([{
  //   email: 'gurnirunjun.shergill@gmail.com',
  //   password: 'root',
  //   username: 'gurni'
  // }]);
  // const userData = await getUser();
  // await deleteUser('gurnirunjun.shergill1@gmail.com')
  // if (!userData.exists) {
  //   console.log('No such document!');
  // } else {
  //   console.log('Document data:', userData.data());
  // }
  // await updateUser('gurnirunjun.shergill@gmail.com', {username: 'gurn'})
  res.send('Hello World!')
})

app.post('/add-user', async (req, res) => {
  // await addUser([{
  //   email: 'gurnirunjun.shergill2@gmail.com',
  //   password: 'root',
  //   username: 'gurni'
  // }]);
  res.send('Got a POST request')
})

app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})

app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

