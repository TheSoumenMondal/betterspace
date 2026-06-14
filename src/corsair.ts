import "dotenv/config";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";
import { createCorsair } from "corsair";
import { Pool } from "pg";

import { env } from "./env";

const pool = new Pool({ connectionString: env.DATABASE_URL });

const corsair = createCorsair({
	kek: env.CORSAIR_KEK,
	database: pool,
	multiTenancy: true,
	plugins: [
		gmail({
			authType: "oauth_2",
		}),
		googlecalendar({
			authType: "oauth_2",
		}),
	],
});

export { corsair };
