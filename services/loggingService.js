import { LogModel } from "../mongoose/schemas.js";

const log = async (service, calendar, json) => {
  const log = new LogModel({
    service,
    calendar,
    json,
  });
  return(await log.save());
}

export default log;