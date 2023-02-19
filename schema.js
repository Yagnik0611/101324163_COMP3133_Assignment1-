const { gql } = require('apollo-server-express');

exports.typeDefs = gql `


        type User {
            username: String!
            email: String!
            password: String!
            
        }
        type signUp {
           user: User!
           msg: String!
            
        }
        type AuthPayload {
            user: User!
            token: String!
          }
type delete{
     id: String!
   
     email : String!
     msg : String!
}
    type Employee {
     
        firstname: String!
        lastname: String!
        email: String!
        gender: String!
        salary: Float!
      
    }

    type Query {
        login(email: String!,password: String! ): AuthPayload!
        getEmployees: [Employee]
        getEmployeeByID(id: ID!): Employee
        getEmployeeByGender(gender: String!): [Employee]
    }

    type Mutation {
        signup(username: String!,
             email: String!, password: String!): signUp!
             
        addEmployee(firstname: String!
            lastname: String!
            email: String!
            gender: String!
            salary: Float!
            ): Employee
        

        updateEmployee(
            id: String
            firstname: String
            lastname: String
            email: String
            gender: String
   
            salary: Float
            ): Employee
        
        deleteEmployee(id: String): delete!
    }
`