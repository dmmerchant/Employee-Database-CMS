INSERT INTO department (name)
VALUES ("Engineering"),("Procurement"),("Quality"),("Sales and Marketing"),("Human Resources");

INSERT INTO role (title,salary,department_id)
VALUES ("Process Engineer",75000,1),
        ("Product Engineer",125000,1),
        ("VP of Engineering",150000,1),
        ("Buyer",60000,2),
        ("Directer of Procurement",100000,2),
        ("Quality Manager",110000,3),
        ("Quality Engineer",100000,3),
        ("Direct of Sales",140000,4),
        ("Sales Rep",100000,4),
        ("Inside Sales Associate",50000,4),
        ("Director of Human Resourcse",100000,5),
        ("HR Administrator",50000,5);

INSERT INTO employee (first_name, last_name,role_id,manager_id)
VALUES ("Randall", "Patterson",3,NULL),
       ("Jillian", "Holmes",1,1),
       ("Jefferson","Boyle",1,1),
       ("Edgardo", "Juarez",2,1),
       ("Desiree", "Cunningham",5,NULL),
       ("Hans", "Strickland",4,5),
       ("Arline", "Key",6,NULL),
       ("Korey", "Adkins",7,7),
       ("Tim", "Carlson",8,NULL),
       ("Rudolph", "Montes",9,9),
       ("Jessica", "Walsh",10,9),
       ("Rhonda", "Best",11,NULL),
       ("Scotty", "Cantu",12,12);