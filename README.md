# citaPreviaPadron

An app I wrote to help myself get an appointment for the Padrón de Habitantes de Torrevieja.

It works by visiting the page every 15 minutes, checking the appointment schedule, and logging the contents of the appointment calendar to MongoDB.

If it finds appointments, it will attempt to make an appointment and update an entry on MongoDB to prevent future attempts.

## Techs used:

- Node JS
- MongoDB/Mongoose

## Packages used: 

- [Mongoose](https://www.npmjs.com/package/mongoose)
- [node-schedule](https://www.npmjs.com/package/node-schedule)
- [puppeteer](https://www.npmjs.com/package/puppeteer)
- [dotenv](https://www.npmjs.com/package/dotenv)

## License
[Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0) ](https://creativecommons.org/licenses/by-nc-sa/3.0/)