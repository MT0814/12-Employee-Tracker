INSERT INTO department (name)
VALUES ("Engineer"),
       ("Finance"),
       ("Human Resource"),
       ("Product"),
       ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Senior Engineer", 100000, 1),
       ("Financial Manager", 90000, 2),
       ("Human Resource Manager", 50000, 3),
       ("Product Manager", 100000, 4),
       ("Marketing Manager", 80000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Justin", "Bieber", 1, null),
       ("Megan", "Fox", 3, null),
       ("Jessica", "Alba", 4, null),
       ("Lily", "Collins", 2, null),
       ("Gal", "Gadot", 5, null);

  