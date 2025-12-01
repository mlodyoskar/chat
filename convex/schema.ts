import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires a schema.
export default defineSchema({
  ...authTables,
});
