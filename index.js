import puppeteer from "puppeteer";
import fs from "fs";

const service = "Alcaldía";
const calendar = "Enlaces matrimoniales (Solo si ha tramitado el expediente ante el Registro Civil)";
const documentNumber = "12345678";
const givenName = "name";
const firstSurname = "firstSurname";
const secondSurname = "secondSurname";
const email = "email@email.com";
const mobile = "123456789";

const navigateSedeElectronica = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://torrevieja.sedelectronica.es/citaprevia");
  await page.setViewport({ width: 1080, height: 1024 });
  const buttonSelector = await page.waitForSelector(`text/${service}`);
  await buttonSelector.click();
  const citaPreviaButton = await page.waitForSelector(
    `text/${calendar}`
  );
  setTimeout(async () => {
    await citaPreviaButton.click();
  }, 2000);
  setTimeout(async () => {
    const appointmentDates = await page.waitForSelector(
      "div > .appointmentDates"
    );
    const appointmentDatesInnerHTML = await page.evaluate(
      (appointmentDates) => appointmentDates.innerHTML,
      appointmentDates
    );
  }, 5000);
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
    await page.select(
      "[name='solicitorDocumentType']",
      "PASSPORT"
    );
  }, 16000);
  
  setTimeout(async () => {
    await page.type("[name='solicitorData.nif']", documentNumber);
  }, 16200);
  setTimeout(async () => {
    await page.type("[name='solicitorData.firstSurname']", firstSurname);
  }, 16400);
  setTimeout(async () => {
    await page.type("[name='solicitorData.secondSurname']", secondSurname);
  } , 16600);
  setTimeout(async () => {
    await page.type("[name='solicitorData.name']", givenName);
  }
  , 16800);
  setTimeout(async () => {
    await page.type("[name='solicitorData.email']", email);
  } , 17000);
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
  }*/
};

navigateSedeElectronica();
