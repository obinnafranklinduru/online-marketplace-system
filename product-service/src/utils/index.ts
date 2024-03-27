import { ConnectDB } from "./db-connection";

ConnectDB()
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => console.log(err));
