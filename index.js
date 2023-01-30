import puppeteer from "puppeteer";
import pkg from "html2json";
const { html2json } = pkg;
import log from "./services/loggingService.js";
import mongoose from "mongoose";
import pkgSchedule from "node-schedule";
console.log("pkgSchedule", pkgSchedule);
const { scheduleJob } = pkgSchedule;


const service = "Padrón de habitantes";
const calendar = "Cita previa Padrón de Habitantes";
const testService = "Alcaldía";
const testCalendar =
  "Enlaces matrimoniales (Solo si ha tramitado el expediente ante el Registro Civil)";
const documentNumber = "12345678";
const givenName = "name";
const firstSurname = "firstSurname";
const secondSurname = "secondSurname";
const email = "email@email.com";
const mobile = "123456789";
const MONGO_URL = "mongodb://localhost:27017/citaPrevia";

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URL);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error.message);
  } finally {
    console.log("Connected to MongoDB");
  }
};

connect();

// Checks for appointments and logs the result to mongoDB
const logAppointments = async (service, calendar) => {
  // Open a new browser window and navigate to the specified page
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://torrevieja.sedelectronica.es/citaprevia.1");
  await page.setViewport({ width: 1080, height: 1024 });

  // Select the service and calendar
  const buttonSelector = await page.waitForSelector(`text/${service}`);
  await buttonSelector.click();
  const citaPreviaButton = await page.waitForSelector(`text/${calendar}`);
  setTimeout(async () => {
    await citaPreviaButton.click();
  }, 2000);
  setTimeout(async () => {
    const appointmentDates = await page.waitForSelector(
      "div > .appointmentDates"
    );

    // Get innerHTML and log it to mongoDB
    const appointmentDatesInnerHTML = await page.evaluate(
      (appointmentDates) => appointmentDates.innerHTML,
      appointmentDates
    );
    const appointmentDatesJSON = html2json(appointmentDatesInnerHTML);
    const logResult = await log(service, calendar, appointmentDatesJSON);
    console.log("Logging appointment details. Result is: ", logResult);
  }, 5000);
};

const runJobs = () => {
  console.log("Running jobs...");
  logAppointments(service, calendar);
};

const onHour = scheduleJob("30 0 * * * *", runJobs);
const onQuarterHour = scheduleJob("30 15 * * * *", runJobs);
const onHalfHour = scheduleJob("30 30 * * * *", runJobs);
const onThreeQuarterHour = scheduleJob("30 45 * * * *", runJobs);

// The below code will book an appointment if one is available. 
// It works but, for now, it's commented out because I'm just 
// interested in logging the appointment details for a short time 
// before I pull the trigger on booking one.

/*const navigateSedeElectronica = async () => {
  // Attempt to book an appointment
  setTimeout(async () => {
    const firstAppointmentDate = await page.waitForSelector(
      "div > .appointmentDates > li:nth-child(1) > a"
    );
    await firstAppointmentDate.click();
  }, 8000);
  setTimeout(async () => {
    const firstAppointment = await page.waitForSelector(
      "div > .appointments > li:nth-child(1) > a"
    );
    await firstAppointment.click();
  }, 10000);
  setTimeout(async () => {
    const cont = await page.waitForSelector("text/Continuar");
    await cont.click();
  }, 12000);
  setTimeout(async () => {
    await page.select("[name='solicitorDocumentType']", "PASSPORT");
  }, 16000);

  setTimeout(async () => {
    await page.type("[name='solicitorData.nif']", documentNumber);
  }, 16200);
  setTimeout(async () => {
    await page.type("[name='solicitorData.firstSurname']", firstSurname);
  }, 16400);
  setTimeout(async () => {
    await page.type("[name='solicitorData.secondSurname']", secondSurname);
  }, 16600);
  setTimeout(async () => {
    await page.type("[name='solicitorData.name']", givenName);
  }, 16800);
  setTimeout(async () => {
    await page.type("[name='solicitorData.email']", email);
  }, 17000);
  setTimeout(async () => {
    await page.type("[name='solicitorData.mobile']", mobile);
  }, 17200);
  setTimeout(async () => {
    const beenInformed = await page.waitForSelector(
      "input[name='rgpd:declareHaveBeenInformed']"
    );
    await beenInformed.click();
  }, 17400);
  /*setTimeout, async () => {
    const cont = await page.waitForSelector("text/Enviar");
    await cont.click();
  }
};

navigateSedeElectronica();
*/
