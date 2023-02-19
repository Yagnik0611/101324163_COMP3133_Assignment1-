const { gql } = require('apollo-server-express');

exports.typeDefs = gql `
    type Employee {
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
        gender: String!
        salary: Float!
      
    }

    type Query {
        getEmployees: [Employee]
        getEmployeeByID(id: ID!): Employee
        getEmployeeByGender(gender: String!): [Employee]
    }

    type Mutation {
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
        
        deleteEmployee(id: String): Employee
    }
`