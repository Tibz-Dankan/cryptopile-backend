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

-- This is should be created in production as well (DONE)
CREATE TABLE adminKeys (
adminKeyId SERIAL PRIMARY KEY , 
generatedBy INTEGER NOT NULL,
adminKey VARCHAR(40) NOT NULL,
createdOn VARCHAR (50) NOT NULL,
usedBy INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE todo (
    todoId SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    userName VARCHAR(100) NOT NULL,
    description VARCHAR(600) NOT NULL,
    iv VARCHAR(60) NOT NULL,
    dateOfAdd VARCHAR(20) NOT NULL DEFAULT 'Sun Feb 13 2022',
    timeOfAdd VARCHAR(20) NOT NULL DEFAULT '4:30:42 PM'
);

CREATE TABLE imageUrl (
     imageUrlId SERIAL PRIMARY KEY,
     imageUrlCategory VARCHAR (50) NOT NULL,
     imageUrlOwnerId INTEGER NOT NULL DEFAULT 20221501, 
     imageUrl VARCHAR(250) NOT NULL DEFAULT null
);

 -- to added in production as well (DONE)
CREATE TABLE auth (  
     authId SERIAL PRIMARY KEY,
     userId  INTEGER NOT NULL,
     token VARCHAR(150) NOT NULL, 
     isOnline BOOLEAN NOT NULL DEFAULT 'false'
);

-- -- ADD THESE COLUMNS AGAIN WITH RIGHT DATA TYPES AND CONSTRAINTS
-- ALTER TABLE todo ADD COLUMN dateOfAdd VARCHAR(20) NOT NULL DEFAULT 'Sun Feb 13 2022';     
-- ALTER TABLE todo ADD COLUMN timeOfAdd VARCHAR(20) NOT NULL DEFAULT '4:30:42 PM';
ALTER TABLE todo ADD COLUMN todoMarkedComplete BOOLEAN NOT NULL DEFAULT 'false'; -- to added in production as well(DONE)
ALTER TABLE accounts ADD COLUMN roles VARCHAR(15) NOT NULL DEFAULT 'user'; -- to created in production



-- DELETE SOME COLUMNS
-- ALTER TABLE todo DROP COLUMN dateOfAdd ;     
-- ALTER TABLE todo DROP COLUMN timeOfAdd ;     

 