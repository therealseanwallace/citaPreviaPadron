# citaPreviaPadron

An app I wrote to help myself get an appointment for the Padrón de Habitantes de Torrevieja.

It works by visiting the page every 15 minutes, checking the appointment schedule, and logging the contents of the appointment calendar to MongoDB.

If it finds appointments, it will attempt to make an appointment and toggle a variable to prevent further attempts.

## Techs used:

- Node JS
- MongoDB/Mongoose

## Packages used: 

- [html2json](https://www.npmjs.com/package/html2json)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [node-schedule](https://www.npmjs.com/package/node-schedule)
- [puppeteer](https://www.npmjs.com/package/puppeteer)
- [edit-dotenv](https://www.npmjs.com/package/edit-dotenv)
- [node-schedule](https://www.npmjs.com/package/node-schedule)

## License
[Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0) ](https://creativecommons.org/licenses/by-nc-sa/3.0/)