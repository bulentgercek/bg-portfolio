import express from "express";
import cors from "cors";
import helmet from "helmet";
import env from "./validEnv";
import { dsConnection } from "./connections";
import * as queries from "./queries";
import { Media, MediaType } from "./entity/Media";
import { Content } from "./entity/Content";

/**
 *  Server initialization and configuration
 */
const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());

/**
 * TypeORM initialization and configuration
 */
const ds = dsConnection(env.DATABASE_URL);

/**
 * Server API Routers
 */
// Add a media
server.post("/add-media/", (req, res) => {
  const media = new Media();
  media.name = "My Media";
  media.columns = 1;
  media.type = MediaType.Image;
  media.url = "https://example.com/image.jpg";

  queries.addMedia(ds, media).then((data) => res.json(data));
});

// Add a content
server.post("/add-content/", async (req, res) => {
  const content = new Content();
  content.name = "My Image Grid";
  content.columns = 3;

  const mediaRepo = ds.getRepository(Media);
  const media = await mediaRepo.findOneBy({
    id: 1,
  });
  content.media = [media];
  console.log(content);
});

// Get all users
server.get("/get-media/", (req, res) => {
  queries.getAllMedia(ds).then((data) => res.json(data));
});

/**
 * Server Activation
 */
server.listen(env.PORT, () => {
  console.log(`Server started and listening on port ${env.PORT}.`);
});
