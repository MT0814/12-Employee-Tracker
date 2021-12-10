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
  welcome();
})



const welcome = () => {
  console.log("⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆")
  console.log("⋆   __         __       __       __  __   ⋆")
  console.log("⋆  |__ |\\  /| |__| |   |  | \\ / |__ |__   ⋆")
  console.log("⋆  |__ | \\/ | |    |__ |__|  |  |__ |__   ⋆")
  console.log("⋆           _          _    __   __  __   ⋆")
  console.log("⋆  |\\  /|  /_\\  |\\ |  /_\\  | _  |__ |__|  ⋆")
  console.log("⋆  | \\/ | /   \\ | \\| /   \\ |__| |__ |  \\  ⋆")
  console.log("⋆                                         ⋆")
  console.log("⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆")
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
      message: "Select an item from the list",
      name: "choice",
      choices: mainLists,
    }
  ])
    .then(answers => {
      if (answers.choice === "View All Employees") {
        viewAllEmployees();
      }

      else if (answers.choice === "View All Departments") {
        viewAllDepts();
      }

      else if (answers.choice === "View All Employees By Department") {
        employeeByDept();
      }


      else if (answers.choice === "View All Roles") {
        viewAllRoles();
      }

      else if (answers.choice === "Add A Department") {
        addDept();
      }

      else if (answers.choice === "Add A Role") {
        addRole();
      }

      else if (answers.choice === "Add An Employee") {
        addEmployee();
      }

      else if (answers.choice === "Update An Employee Role") {
        updateEmployee();
      }

      else if (answers.choice === "Update A Manager") {
        updateManager();
      }

      else if (answers.choice === "Delete A Department") {
        deleteDept();
      }

      else if (answers.choice === "Delete A Role") {
        deleteRole();
      }

      else if (answers.choice === "Delete An Employee") {
        deleteEmployee();
      }

      else if (answers.choice === "Leave") {
        console.log("Bye!")
        db.end();
      }

    });
};

// View all employees 
const viewAllEmployees = () => {
  db.query(`SELECT employee.id, 
  employee.first_name, 
  employee.last_name, 
  role.title, 
  department.name AS department,
  role.salary, 
  CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id`, (err, result) => {
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
      message: "Please enter a department.",
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
      message: "Please enter a role.",
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
      message: "Please enter a salary for this role.",
      validate: function (addSalary) {
        if (isNaN(addSalary)) {
          return "Please enter a salary."
        } else {
          return true;
        }
      }
    }
  ])
    .then(answer => {
      const params = [answer.role, answer.salary];
      db.query(`SELECT name, id FROM department`, (err, result) => {
        if (err) {
          console.log(err);
        }
        const dept = result.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
          {
            type: 'list',
            name: 'dept',
            message: "Please enter a department for this role.",
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
              console.log('Done! This ' + answer.role + " role has been added successfully!");
              viewAllRoles();
            });
          });
      });
    });
};


// Add an employee
const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "Please enter the employee's first name.",
      validate: answer => {
        if (answer.length < 1) {
          return console.log("A valid first name is required.");
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "Please enter the employee's last name.",
      validate: answer => {
        if (answer.length < 1) {
          return console.log("A valid last name is required.");
        }
        return true;
      }

    }
  ])
    .then(answer => {
      const params = [answer.firstName, answer.lastName]

      db.query(`SELECT role.id, role.title FROM role`, (err, result) => {
        if (err) {
          console.log(err);
        }
        const roles = result.map(({ id, title }) => ({ name: title, value: id }));

        inquirer.prompt([
          {
            type: 'list',
            name: 'role',
            message: "Please enter a role for this employee.",
            choices: roles
          }
        ])
          .then(roleChoice => {
            const role = roleChoice.role;
            params.push(role);

            db.query(`SELECT * FROM employee`, (err, result) => {
              if (err) {
                console.log(err);
              }

              const managers = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: "Who is the employee's manager?",
                  choices: managers
                }
              ])
                .then(managerChoice => {
                  const manager = managerChoice.manager;
                  params.push(manager);

                  db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES (?, ?, ?, ?)`, params, (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    console.log("Done! " + answer.firstName + " has been added to employees!")

                    viewAllEmployees();
                  });
                });

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
        db.query(`SELECT * FROM role`, (err, result) => {
          if (err) {
            console.log(err);
          }
          const roles = result.map(({ id, title }) => ({ name: title, value: id }));
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

              db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, params, (err, result) => {
                if (err) {
                  console.log(err);
                }
                console.log("Done! This employee has been updated!");
                viewAllEmployees();
              });
            });
        });
      });
  });
};


// Update an manager
const updateManager = () => {

  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const employees = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Please select an employee that you want to update.",
        choices: employees
      }
    ])
      .then(employeeChoice => {
        const employee = employeeChoice.name;
        const params = [];
        params.push(employee);
        db.query(`SELECT * FROM employee`, (err, result) => {
          if (err) {
            console.log(err);
          }
          const managers = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

          inquirer.prompt([
            {
              type: 'list',
              name: 'manager',
              message: "Please select a manager for this employee",
              choices: managers
            }
          ])
            .then(managerChoice => {
              const manager = managerChoice.manager;
              params.push(manager);

              let employee = params[0]
              params[0] = manager
              params[1] = employee

              db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, params, (err, result) => {
                if (err) {
                  console.log(err);
                }
                console.log("Done! This employee's manager has been updated!");
                viewAllEmployees();
              });
            });
        });
      });
  });
};

// Delete a dept
const deleteDept = () => {

  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const dept = result.map(({ name, id }) => ({ name: name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'dept',
        message: "Please select a department that you want to delete.",
        choices: dept
      }
    ])
      .then(deptChoice => {
        const dept = deptChoice.dept;
        db.query(`DELETE FROM department WHERE id = ?`, dept, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log("Done! This department has been deleted!");
          viewAllDepts();
        });
      });
  });
};

// Delete a role
const deleteRole = () => {
  db.query(`SELECT * FROM role`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const role = result.map(({ title, id }) => ({ name: title, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: "Please select a role that you want to delete.",
        choices: role
      }
    ])
      .then(roleChoice => {
        const role = roleChoice.role;
        db.query(`DELETE FROM role WHERE id = ?`, role, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log("Done! This role has been deleted!");
          viewAllRoles();
        });
      });
  });
};

// Delete an employee
const deleteEmployee = () => {

  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const employees = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: "Please select an employee that you want to delete.",
        choices: employees
      }
    ])
      .then(employeeChoice => {
        const employee = employeeChoice.employee;
        db.query(`DELETE FROM employee WHERE id = ?`, employee, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log("Done! This employee has been deleted!");
          viewAllEmployees();
        });
      });
  });
};