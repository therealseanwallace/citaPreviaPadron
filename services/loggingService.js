import { LogModel } from "../mongoose/schemas.js";

const log = async (service, calendar, json) => {
  const log = new LogModel({
    service,
    calendar,
    json,
    obtained: false,
  });
  return(await log.save());
}

const updateLogWithObtained = async (id) => {
  console.log('updating log with obtained: ', id);
  const log = await LogModel.findByIdAndUpdate(id, { obtained: true });
  console.log('log is now: ', log);
  return log;
}

const checkForLogWithObtained = async () => {
  console.log('checking for log with obtained');
  const log = await LogModel.findOne({ obtained: true });
  console.log('log is: ', log);
  return log;
}

export { log, updateLogWithObtained, checkForLogWithObtained  };