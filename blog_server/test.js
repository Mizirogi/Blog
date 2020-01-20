const {User,UserInfo} = require('./db/model/users')
const { getAllCustomers, getCustomerById, getCustomerByName, createCustomer, updateCustomer, deleteCustomer } = require('./db')

async function createUser(user){
    console.log(user);
    return User.create(user)
  }
  user={name:'liyang',pwd:123123}
  user2={name:'lig',pwd:123123}
  createUser(user)
  createUser(user2)