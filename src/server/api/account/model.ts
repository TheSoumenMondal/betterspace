import { z } from "zod";

const checkServiceConnectionStatusInput = z.object({
	corsairIntegrationName: z.enum(["gmail", "googlecalendar"]),
});

const checkServiceConnectionStatusOutput = z.object({
	serviceConnectionStatus: z.boolean(),
});

const undefinedSchema = z.undefined();

export {
	checkServiceConnectionStatusInput,
	checkServiceConnectionStatusOutput,
	undefinedSchema,
};
