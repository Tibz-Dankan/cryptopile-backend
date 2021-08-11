CREATE DATABASE stockpile;

CREATE TABLE registers (
    id BIGSERIAL PRIMARY KEY ,
   firstname VARCHAR(255) NOT NULL,
   lastname VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL,
   gender VARCHAR(50) NOT NULL,
   password VARCHAR(255) NOT NULL,
   UNIQUE (email) 
);

CREATE TABLE pile (
    pile_id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    title VARCHAR(300) NOT NULL,
    description VARCHAR(600) NOT NULL,
    time_of_add TIME,
    date_of_add TIMESTAMP
);


CREATE TABLE secretes (
secrete_id BIGSERIAL PRIMARY KEY,
user_id INT NOT NULL,
user_name VARCHAR(50) NOT NULL,
secrete_title VARCHAR(250) NOT NULL,
secrete_description VARCHAR(400) NOT NULL
);

--    To add the columns named  date&time, updated ,detele to store the deleteled data from the pile table

-- ALTER TABLE pile ADD COLUMN date_of_add DATE;
-- ALTER TABLE pile ADD COLUMN date_of_add TIME ;     -- this is for trial purpoese
-- ALTER TABLE pile ADD COLUMN date_of_add TIMESTAMP ;     -- this is for trial purpoese
-- ALTER TABLE pile ADD COLUMN date_of_add TIMESTAMP '2004-10-19 10:23:54' ;     -- this is for trial purpose noy working
-- ALTER TABLE pile ADD COLUMN date_of_add DATE, TIME, TIMESTAMP ;     -- this is for trial purpose
-- ALTER TABLE pile ADD COLUMN time_of_add TIME; 
-- ALTER TABLE pile ADD COULUMN user_Id INT(10); -- added with lots of love
-- ALTER TABLE pile ADD COULUMN user_name VARCHAR(255);

-- When it comes to production time please remeber to add notnull constrants to 
-- the data time columns added ti the pile table 


-- -- DROPING THESE COLUMNS TO ADD MORE CONSTRAINTS
-- ALTER TABLE pile DROP date_of_add;
-- ALTER TABLE pile DROP time_of_add;

     /*The to add the data and time automatically to all The Tables*/