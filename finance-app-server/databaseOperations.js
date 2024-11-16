const getUser = async (database) => {
    await database;
    const collection = database.collection('database');
    const userData = await collection.doc('user').get();
    return userData;
  }
  
const addUser = async (database, dataToBeAdded) => {
    await database;
    const existingUserData = await getUser();
    const collection = database.collection('database');
    const { users } = existingUserData.data();
    const {email, password, username} = dataToBeAdded;
    if (users.length > 0)
      await collection.doc('user').set(
        {
          users: [...users, {
            email: email,
            password: password,
            username: username
          }]
        }
      );
    else await collection.doc('user').set(
      {
        users: [{
          email: email,
          password: password,
          username: username
        }]
      }
    );
  }
  
const deleteUser = async (email) =>{
    
  }

module.exports = {addUser, getUser}