require("dotenv").config();

const mongoose = require("mongoose");

// EMPLOYEE SCHEMA
const employeeSchema = new mongoose.Schema({

    employeeId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    salary: {
        type: Number,
        required: true
    },

    experience: {
        type: Number,
        required: true
    },

    skills: {
        type: [String]
    },

    status: {
        type: String,
        required: true
    }

});

const Employee = mongoose.model("Employee", employeeSchema);


async function main() {

    try {

        // CONNECT
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        await Employee.deleteMany({});
        // INSERT 4 EMPLOYEES
        await Employee.insertMany([

            {
                employeeId: "E101",
                name: "Rahul",
                department: "IT",
                designation: "Developer",
                salary: 50000,
                experience: 3,
                skills: ["JavaScript", "Node.js"],
                status: "Active"
            },

            {
                employeeId: "E102",
                name: "Priya",
                department: "HR",
                designation: "HR Executive",
                salary: 45000,
                experience: 4,
                skills: ["Recruitment", "Communication"],
                status: "Active"
            },

            {
                employeeId: "E103",
                name: "Arun",
                department: "IT",
                designation: "Senior Developer",
                salary: 70000,
                experience: 6,
                skills: ["Java", "MongoDB"],
                status: "Active"
            },

            {
                employeeId: "E104",
                name: "Divya",
                department: "Finance",
                designation: "Accountant",
                salary: 55000,
                experience: 5,
                skills: ["Excel", "Accounting"],
                status: "Active"
            }

        ]);

        console.log("\n4 Employees Inserted");


        // SELECT
        // IT department with experience greater than 2
        const employees = await Employee.find({

            department: "IT",

            experience: { $gt: 2 }

        });

        console.log("\nIT Employees with Experience > 2:");
        console.log(employees);


        // SELECT ONE
        // Find employee using employeeId
        const oneEmployee = await Employee.findOne({

            employeeId: "E101"

        });

        console.log("\nEmployee with ID E101:");
        console.log(oneEmployee);


        // DISPLAY ONLY NAME, DESIGNATION, SALARY AND DEPARTMENT
        const employeeDetails = await Employee.find(

            {},

            {
                _id: 0,
                name: 1,
                designation: 1,
                salary: 1,
                department: 1
            }

        );

        console.log("\nSelected Employee Details:");
        console.log(employeeDetails);


        // UPDATE DESIGNATION AND SALARY
        const updatedEmployee = await Employee.findOneAndUpdate(

            { employeeId: "E101" },

            {
                designation: "Senior Developer",
                salary: 60000
            },

            { new: true }

        );

        console.log("\nUpdated Employee:");
        console.log(updatedEmployee);


        // INCREASE SALARY OF ALL IT EMPLOYEES BY 10%
        await Employee.updateMany(

            { department: "IT" },

            {
                $mul: {
                    salary: 1.10
                }
            }

        );

        console.log("\nIT employee salaries increased by 10%");


        // FIND EMPLOYEES WITH SALARY BETWEEN 50000 AND 80000
        const salaryEmployees = await Employee.find({

            salary: {
                $gte: 50000,
                $lte: 80000
            }

        });

        console.log("\nEmployees with salary between 50000 and 80000:");
        console.log(salaryEmployees);


        // DELETE ONE EMPLOYEE USING employeeId
        const deletedEmployee = await Employee.findOneAndDelete({

            employeeId: "E104"

        });

        console.log("\nDeleted Employee:");
        console.log(deletedEmployee);


        // DISPLAY REMAINING EMPLOYEES
        // SORTED BY SALARY DESCENDING
        const remainingEmployees = await Employee.find()
            .sort({ salary: -1 });

        console.log("\nRemaining Employees Sorted by Salary:");
        console.log(remainingEmployees);


    } catch (error) {

        console.log("Error:");
        console.log(error);

    } finally {

        await mongoose.connection.close();

        console.log("\nMongoDB connection closed");

    }

}

main();