# mjTables
Application to manage role play games and tables in an association / group

## Front
* AngularJS
* Jade
* Bootstrap
* Tests powered by Karma/Jasmine (upcoming)

## Back
* NodeJS
* RESTful API
* MySQL database

## Environment variables
### Required
* MAIL_ADRESSE
* MAIL_PASSWORD
* WEBTOKEN_SECRET
* USERCREATION_CODE

### Optionals
* PORT
* CLEARDB_DATABASE_URL (plugin Heroku to host MySQL database. If does not exist, connects to a local instance of MySQL Server. See `back/database.js`)

## Installation
`npm install`

## Run
`foreman start`
