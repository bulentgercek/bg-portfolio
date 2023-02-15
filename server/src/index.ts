import server from "./server";
import env from "./validEnv";

/**
 * Server Activation
 */
server.listen(env.PORT, () => {
  console.log(`Server started and listening on port ${env.PORT}.`);
});
