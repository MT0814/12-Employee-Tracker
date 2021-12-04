const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');


// Connect tobase
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'millie',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

db.connect((err) => {
  if (err) throw err;
  welcome();
})



const welcome = () => {
  console.log("⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆")
  console.log("⋆   __         __       __       __  __   ⋆")
  console.log("⋆  |__ |\\  /| |__| |   |  | \\ / |__ |__   ⋆")
  console.log("⋆  |__ | \\/ | |    |__ |__|  |  |__ |__   ⋆")
  console.log("⋆           _          _    __   __  __   ⋆")
  console.log("⋆  |\\  /|  /_\\  |\\ |  /_\\  | _  |__ |__|  ⋆")
  console.log("⋆  | \\/ | /   \\ | \\| /   \\ |__| |__ |  |  ⋆")
  console.log("⋆                                         ⋆")
  console.log("⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆")
  questionsInit();
}

const mainLists = [
  "View All Employees",
  "View All Employees By Department",
  "View All Departments",
  "View All Roles",
  "Add A Department",
  "Add A Role",
  "Add An Employee",
  "Update An Employee Role",
  "Update A Manager",
  "Delete A Department",
  "Delete A Role",
  "Delete An Employee",
  "Leave"
];

const questionsInit = () => {
  inquirer.prompt([
    {
      type: "rawlist",
      message: "Select an item on the list",
      name: "choice",
      choices: mainLists,
    }
  ])
    .then(answers => {
      if (answers.choice === "View All Employees") {
        viewAllEmployees();
      }

      if (answers.choice === "View All Departments") {
        viewAllDepts();
      }

      if (answers.choice === "View All Employees By Department") {
        employeeByDept();
      }


      if (answers.choice === "View All Roles") {
        viewAllRoles();
      }

      if (answers.choice === "Add A Department") {
        addDept();
      }

      if (answers.choice === "Add A Role") {
        addRole();
      }

      if (answers.choice === "Add An Employee") {
        addEmployee();
      }

      if (answers.choice === "Update An Employee Role") {
        updateEmployee();
      }

      if (answers.choice === "Update A Manager") {
        updateManager();
      }

      if (answers.choice === "Delete A Department") {
        deleteDept();
      }

      if (answers.choice === "Delete A Role") {
        deleteRole();
      }

      if (answers.choice === "Delete An Employee") {
        deleteEmployee();
      }

      if (answers.choice === "leave") {
        console.log("Done! Your employees data has been updated!")
        db.end();
      }

    });
};

// View all employees 
const viewAllEmployees = () => {
  const sql = `SELECT employee.id, 
                      employee.first_name, 
                      employee.last_name, 
                      role.title, 
                      department.name AS department,
                      role.salary, 
                      CONCAT (manager.first_name, " ", manager.last_name) AS manager
               FROM employee
                      LEFT JOIN role ON employee.role_id = role.id
                      LEFT JOIN department ON role.department_id = department.id
                      LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    questionsInit();
  });
};

// View all departments
const viewAllDepts = () => {
  const sql = `SELECT department.id AS id, department.name AS department FROM department`;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    questionsInit();
  });
};

// View employee by department
const employeeByDept = () => {
  const sql = `SELECT employee.first_name, 
                      employee.last_name, 
                      department.name AS department
               FROM employee 
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN department ON role.department_id = department.id`;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    questionsInit();
  });
};

// View all roles 
const viewAllRoles = () => {

  const sql = `SELECT role.id, role.title, department.name AS department
               FROM role
               INNER JOIN department ON role.department_id = department.id`;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    questionsInit();
  });
};

// Add a department 
const addDept = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'addDept',
      message: "Please enter a department",
      validate: function (answer) {
        if (answer.length < 1) {
          return console.log("A valid department is required.");
        }
        return true;
      }
    }
  ])
    .then(answer => {
      const sql = `INSERT INTO department (name)
                VALUES (?)`;
      db.query(sql, answer.addDept, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log('Done! Added ' + answer.addDept + " to departments!")
        viewAllDepts();
      });
    });
};

// Add a role
const addRole = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'role',
      message: "Please enter a role",
      validate: function (answer) {
        if (answer.length < 1) {
          return console.log("A valid role is required.");
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: "What is the salary of this role?",
      validate: addSalary => {
        if (isNaN(addSalary)) {
          return "Please enter a salary";
        } else {
          return true;
        }
      }
    }
  ])
    .then(answer => {
      const params = [answer.role, answer.salary];
      db.query(`SELECT name, id FROM department`, (err, data) => {
        if (err) {
          console.log(err);
        }
        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
          {
            type: 'list',
            name: 'dept',
            message: "Please enter a department for this role",
            choices: dept
          }
        ])
          .then(deptChoice => {
            const dept = deptChoice.dept;
            params.push(dept);

            const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`;

            db.query(sql, params, (err, result) => {
              if (err) {
                console.log(err);
              }
              console.log('Done! Added' + answer.role + " to roles!");
              viewAllRoles();
            });
          });
      });
    });
};



// Update an employee
const updateEmployee = () => {

  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const employees = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(employeeChoice => {
        const employee = employeeChoice.name;
        const params = [];
        params.push(employee);
        db.query(`SELECT * FROM role`, (err,result) => {
          if (err) {
            console.log(err);
          }
          const roles =result.map(({ id, title }) => ({ name: title, value: id }));
          inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's new role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              params.push(role);

              let employee = params[0]
              params[0] = role
              params[1] = employee

              db.query( `UPDATE employee SET role_id = ? WHERE id = ?`, params, (err, result) => {
                if (err) {
                  console.log(err);
                }
                console.log("Done! Employee has been updated!");
                viewAllEmployees();
              });
            });
        });
      });
  });
};