import puppeteer from "puppeteer";
import pkg from "html2json";
const { html2json } = pkg;
import log from "./services/loggingService.js";
import mongoose from "mongoose";
import pkgSchedule from "node-schedule";
import dotenv from "dotenv";
import editDotenv from "edit-dotenv";
dotenv.config();

const { scheduleJob, RecurrenceRule, Range } = pkgSchedule;

console.log("pkgSchedule", pkgSchedule);

const service = process.env.SERVICE;
const calendar = process.env.CALENDAR;
const testService = process.env.TEST_SERVICE;
const testCalendar = process.env.TEST_CALENDAR;
const documentNumber = process.env.DOCUMENT_NUMBER;
const givenName = process.env.GIVEN_NAME;
const firstSurname = process.env.FIRST_SURNAME;
const secondSurname = process.env.SECOND_SURNAME;
const email = process.env.EMAIL;
const mobile = process.env.MOBILE;


const MONGO_URL = "mongodb://localhost:27017/citaPrevia";
let appointmentObtained = process.env.APPOINTMENT_OBTAINED;

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

const openNewBrowser = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  return { browser, page };
};

// Checks for appointments and logs the result to mongoDB
const logAppointments = async (service, calendar) => {
  const browser = await openNewBrowser();
  // Navigates to the specified page

  await browser.page.goto("https://torrevieja.sedelectronica.es/citaprevia");

  // Attempts to select the service and calendar and log to mongodb
  try {
    await browser.page.goto("https://torrevieja.sedelectronica.es/citaprevia");
    await browser.page.setViewport({ width: 1080, height: 1024 });
    const buttonSelector = await browser.page.waitForSelector(
      `text/${service}`
    );
    await buttonSelector.click();
    const citaPreviaButton = await browser.page.waitForSelector(
      `text/${calendar}`
    );
    setTimeout(async () => {
      await citaPreviaButton.click();
    }, 10000);
    let appointmentDatesInnerHTML;
    setTimeout(async () => {
      const appointmentDates = await browser.page.waitForSelector(
        "div > .appointmentDates"
      );
      appointmentDatesInnerHTML = await browser.page.evaluate(
        (appointmentDates) => appointmentDates.innerHTML,
        appointmentDates
      );
    }, 20000);
    let result;
    setTimeout(async () => {
      result = await log(service, calendar, appointmentDatesInnerHTML);
      console.log("result is: ", result);
      return result;
    }, 30000);

    // checks if there are appointments, and that an appointment has not already been obtained
    // if so, it attempts to obtain an appointment and toggles the appointmentObtained variable
    setTimeout(async () => {
      if (result.json !== "\n\t\t\t\t\t\n\t\t\t\t" && !appointmentObtained) {
        setTimeout(async () => {
          const firstAppointmentDate = await page.waitForSelector(
            "div > .appointmentDates > li:nth-child(1) > a"
          );
          await firstAppointmentDate.click();
        }, 1000);
        setTimeout(async () => {
          const firstAppointment = await page.waitForSelector(
            "div > .appointments > li:nth-child(1) > a"
          );
          await firstAppointment.click();
        }, 5000);
        setTimeout(async () => {
          const cont = await page.waitForSelector("text/Continuar");
          await cont.click();
        }, 10000);
        setTimeout(async () => {
          await page.select("[name='solicitorDocumentType']", "PASSPORT");
        }, 20000);

        setTimeout(async () => {
          await page.type("[name='solicitorData.nif']", documentNumber);
        }, 22000);
        setTimeout(async () => {
          await page.type("[name='solicitorData.firstSurname']", firstSurname);
        }, 24000);
        setTimeout(async () => {
          await page.type(
            "[name='solicitorData.secondSurname']",
            secondSurname
          );
        }, 26000);
        setTimeout(async () => {
          await page.type("[name='solicitorData.name']", givenName);
        }, 28000);
        setTimeout(async () => {
          await page.type("[name='solicitorData.email']", email);
        }, 30000);
        setTimeout(async () => {
          await page.type("[name='solicitorData.mobile']", mobile);
        }, 32000);
        setTimeout(async () => {
          const beenInformed = await page.waitForSelector(
            "input[name='rgpd:declareHaveBeenInformed']"
          );
          await beenInformed.click();
        }, 34000);
        setTimeout,
          async () => {
            const cont = await page.waitForSelector("text/Enviar");
            await cont.click();
            editDotenv("APPOINTMENT_OBTAINED", "true");
            appointmentObtained = true;
          };
      }
    }, 40000);
    setTimeout(async () => {
      await browser.browser.close();
    }, 600000);
  } catch (error) {
    console.error(
      "Unable to obtain and log appointments. Error is: ",
      error.message
    );
  }
};

const runJobs = () => {
  console.log(`[${Date.now()}] Running jobs...`);
  logAppointments(service, calendar);
};

// Run the jobs at 30 seconds, 15 minutes and 30 seconds,
// 30 minutes and 30 seconds, and 45 minutes and 30 seconds
// past the hour

const rule = new RecurrenceRule();
rule.minute = new Range(0, 59, 15);
rule.second = 30;
const jobsSchedule = scheduleJob(rule, runJobs);

