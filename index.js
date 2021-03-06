'use strict'
const        Table = require('cli-table2')
const { Database } = require('sqlite3').verbose()
const           db = new Database('db/Chinook_Sqlite.sqlite', (err) => {if(err) throw err})

db.serialize(() => {

  db.all(`SELECT FirstName || ' ' || LastName AS Name,
                 CustomerId,
                 Country
          FROM   Customer
          WHERE  Country IS NOT 'USA'
  `, (err, customers) => {
    console.log(customers)
  })

  db.all(`SELECT FirstName || ' ' || LastName AS Name,
                 CustomerId,
                 Country
          FROM   Customer
          WHERE  Country IS 'Brazil'
  `, (err, customers) => {
    console.log(customers)
  })

  db.each(`SELECT FirstName || ' ' || LastName AS Name,
                 CustomerId,
                 Country
          FROM   Customer
          WHERE  Country IS 'Brazil'
  `, (err, {CustomerId, Name, Country}) => {
      console.log(`${CustomerId}: ${Name} ${Country}`)
  })

  const table = new Table({ head: ["ID", "DATE", "COUNTRY"] });
  db.each(`SELECT FirstName || ' ' || LastName AS Name,
                 InvoiceId,
                 InvoiceDate,
                 BillingCountry
          FROM   Invoice
          JOIN   Customer
          ON     Invoice.CustomerId = Customer.CustomerId
          WHERE  Country = 'Brazil'
  `, (err, {InvoiceId, InvoiceDate, BillingCountry}) => {
    let testStr = `${InvoiceId}: ${InvoiceDate} ${BillingCountry}`
    table.push(
        [InvoiceId, InvoiceDate, BillingCountry]
    );
  }, () => console.log(table.toString()))

  const table2 = new Table({ head: ["NAME"], style: {compact: true} });
  db.each(`SELECT FirstName || ' ' || LastName AS Name
           FROM Employee
           WHERE Employee.Title = "Sales Support Agent"
           `, (err, emp) => {
             table2.push(emp)
           }, () => console.log(table2.toString()))

})
db.close()
