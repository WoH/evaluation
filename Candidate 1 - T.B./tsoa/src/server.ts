import "reflect-metadata";
import { createConnection } from "typeorm";
import { app } from "./app";
import { Server } from "http";

const port = process.env.PORT || 3000;

let handler: Server;

createConnection()
  .then(async () => {
    console.log("Established connection to the database");

    handler = app.listen(port, () =>
      console.log(`Example app listening at http://localhost:${port}`)
    );
  })
  .catch((error) => console.log(error));

export { handler };
