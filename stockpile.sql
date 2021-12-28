-- should be commented wen pushing into production
-- CREATE DATABASE stockpile;
--REMEMBER TO CHANGE YOUR SQL NAMING TO CAMEL CASE

-- should be commented out wen pushing into production
-- CREATE TABLE registers (
--     id BIGSERIAL PRIMARY KEY ,
--    firstname VARCHAR(255) NOT NULL,
--    lastname VARCHAR(255) NOT NULL,
--    email VARCHAR(255) NOT NULL,
--    gender VARCHAR(50) NOT NULL,
--    password VARCHAR(255) NOT NULL,
--    UNIQUE (email) 
-- );

--Adding column to check email verifaction status
ALTER TABLE registers ADD COLUMN is_verified_email BOOLEAN;
-- ALTER TABLE registers DROP is_verified;


-- should be commented out wen puahsing into production
-- CREATE TABLE pile (
--     pile_id BIGSERIAL PRIMARY KEY,
--     user_id INT NOT NULL,
--     user_name VARCHAR(100) NOT NULL,
--     title VARCHAR(300) NOT NULL,
--     description VARCHAR(600) NOT NULL,
--     time_of_add TIME,
--     date_of_add TIMESTAMP
-- );

-- add column storage_date and drop columns time_of_add and date_of_add
-- ALTER TABLE pile ADD COLUMN storage_date TIMESTAMP WITH TIME ZONE;
-- ALTER TABLE pile DROP time_of_add;
-- ALTER TABLE pile DROP date_of_add;
-- should be commented wen pushing into production
-- delete the table secretes
-- DROP TABLE secretes;

-- adding the title_iv column and description_iv column and even to the production databsase (heroku)
-- CREATE TABLE secretes (
-- secrete_id BIGSERIAL PRIMARY KEY,
-- user_id INT NOT NULL,
-- user_name VARCHAR(50) NOT NULL,
-- secrete_title VARCHAR(300) NOT NULL,
-- secrete_description VARCHAR(400) NOT NULL,
-- iv VARCHAR(250) NOT NULL
-- );



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


     -- This is my testing table and should not be sent into production
--  CREATE TABLE test_gender (
-- secrete_id BIGSERIAL PRIMARY KEY,
-- gender VARCHAR(50) 
-- );
