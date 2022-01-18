
--REMEMBER TO CHANGE YOUR SQL NAMING TO CAMEL CASE
CREATE DATABASE cryptopile;


CREATE TABLE accounts (
   userId SERIAL PRIMARY KEY ,
   firstName VARCHAR(255) NOT NULL,
   lastName VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,
   verificationCode INTEGER NOT NULL,
   isVerifiedEmail BOOLEAN NOT NULL,
   UNIQUE (email) 
);

CREATE TABLE admin (
adminId SERIAL NOT NULL,
adminFirstName VARCHAR(200) NOT NULL,
adminLastName VARCHAR(200) NOT NULL,
adminEmail VARCHAR(200) NOT NULL,
adminCode INTEGER NOT NULL,
adminPassword VARCHAR(200) NOT NULL
);



CREATE TABLE todo (
    todoId SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    userName VARCHAR(100) NOT NULL,
    description VARCHAR(600) NOT NULL,
    timeOfAdd TIME,
    dateOfAdd TIMESTAMP
);

CREATE TABLE imageUrl (
     imageUrlId SERIAL PRIMARY KEY,
     imageUrlCategory VARCHAR (50) NOT NULL,
     imageUrlOwnerId INTEGER NOT NULL DEFAULT 20221501, 
     imageUrls VARCHAR(250) NOT NULL
);

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
