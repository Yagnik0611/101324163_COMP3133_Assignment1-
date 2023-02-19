const Employee = require('./models/Employee');
const User = require('./models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
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
      
    const generateToken = (user) => {
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          'YOUR_SECRET_KEY',
          { expiresIn: '1h' }
        );
        return token;
      };
      
  
exports.resolvers = {
    Query: {
        login: async (parent, args) => {
            const { email, password } = args;
      console.log(email)
      console.log(password)
            const user = await User.findOne({ email });
            if (!user) {
           
              throw new Error('Invalid credentials');
            }
      
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
              throw new Error('Invalid credentials');
            }
      
            const token = generateToken(user);
         
            

           return {
              user: {
                username: user.username,
                email: user.email
              },
              token
            };
              
            
          },
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
        signup: async (parent, args) => {
            const { username, email, password } = args;
      
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
              throw new Error('User already exists');
            }
      
          
            const user = new User({ username, email, password });
            const savedUser = await user.save();
      const msg ="You have successfully signUp!"
            console.log(savedUser)
          
            return {
              user: {
                username: savedUser.username,
                email: savedUser.email,
                password: savedUser.password

              },
              msg
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
          const msg  ="Employee Deleted!"
          return {
          
             
              email: deletedEmployee.email,
              id: deletedEmployee._id,
              msg : msg
           
          }
        }
     
        catch (err){
        if (err.name === "CastError" && err.kind === "ObjectId") {
            throw new Error("Invalid employee ID");
          }
          throw new Error("Invalid employee ID");
      }}
    }      
}