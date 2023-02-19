const Employee = require('./models/Employee');

    const handleErrors = (err) => {
       
        let errors = { firstname: '', lastname: '' ,email: '', gender: '' ,salary:0};
       
        
        if (err.code === 11000) {
            errors.email = 'that email is already registered';
            return errors;
        } else if (err.message.includes('Employee not found')) {
            errors.id = " Please enter Id to update the Employee";
            console.log(errors);
        } else if (err.message.includes('Employee validation failed') || err.message.includes(' Validation')) {
            // Handle validation error
            const errorObject = err.errors;
            for (const key in errorObject) {
                if (Object.hasOwnProperty.call(errorObject, key)) {
                    errors[key] = errorObject[key].message;
                }
            }
            return errors;
        } else {
            return err;
        }
        
    }
      
    
  
exports.resolvers = {
    Query: {
        getEmployees: async (parent, args) => {
            return Employee.find({})
        },
        getEmployeeByID: async (parent, args) => {
            return Employee.findById(args.id)
        },
        getEmployeeByGender: async (parent, args) => {
            return Employee.find({"gender" : args.gender})
        }
    },

    Mutation: {
        addEmployee: async (parent, args) => {
          
      
          try {
            let newEmp = new Employee({
              firstname: args.firstname,
              lastname: args.lastname,
              email: args.email,
              gender: args.gender,
              salary: args.salary
            });
            await newEmp.save();
                      
            return newEmp;
          } catch (err) {
            const errors = handleErrors(err);
            return errors;
          }
        },
      
updateEmployee: async (parent, args) => {
          
          if (!args.id){
            return ;
          }
         
      
          try {
            const updatedEmployee = await Employee.findOneAndUpdate(
              {
                _id: args.id
              },
              {
                $set: {
                  firstname: args.firstname,
                  lastname: args.lastname,
                  email: args.email,
                  gender: args.gender,
                  salary: args.salary
                }
              }, 
              { new: true, runValidators: true } // to return the updated document
            );
      console.log(updatedEmployee)
            if (updatedEmployee) return updatedEmployee

      
          } catch (err) {
            
            if (err.name === "CastError" && err.kind === "ObjectId") {
                throw new Error("Invalid employee ID");
              }
       
           const errors = handleErrors(err);
           throw new Error(errors.message)
           
          }
        }        
      
    ,      
    deleteEmployee: async (parent, args) => {
        console.log(args)
        if (!args.id) {
          throw new Error("No ID found");
        }
        try {
        const deletedEmployee = await Employee.findByIdAndDelete(args.id);

        if (!deletedEmployee) {
            throw new Error("Employee not found");
          }
          return deletedEmployee;}
     
        catch (err){
        if (err.name === "CastError" && err.kind === "ObjectId") {
            throw new Error("Invalid employee ID");
          }
          throw new Error("Invalid employee ID");
      }}
    }      
}