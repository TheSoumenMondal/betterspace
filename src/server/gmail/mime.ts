type BuildGmailRawMessageInput = {
	from?: string;
	to: string[];
	cc?: string[];
	bcc?: string[];
	subject: string;
	body: string;
	isHtml?: boolean;
	threadId?: string;
};

function foldHeader(name: string, value: string) {
	return `${name}: ${value.replace(/\r?\n/g, " ").trim()}`;
}

function encodeHeaderValue(value: string) {
	if ([...value].every((character) => character.charCodeAt(0) <= 127)) {
		return value;
	}

	return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function normalizeBody(value: string) {
	return value.replace(/\r?\n/g, "\r\n");
}

export function buildGmailRawMessage(input: BuildGmailRawMessageInput) {
	const headers = [
		"MIME-Version: 1.0",
		input.from ? foldHeader("From", input.from) : null,
		foldHeader("To", input.to.join(", ")),
		input.cc?.length ? foldHeader("Cc", input.cc.join(", ")) : null,
		input.bcc?.length ? foldHeader("Bcc", input.bcc.join(", ")) : null,
		foldHeader("Subject", encodeHeaderValue(input.subject)),
		input.threadId ? foldHeader("References", input.threadId) : null,
		input.threadId ? foldHeader("In-Reply-To", input.threadId) : null,
		`Content-Type: ${
			input.isHtml ? "text/html" : "text/plain"
		}; charset="UTF-8"`,
		"Content-Transfer-Encoding: 8bit",
	].filter((header): header is string => Boolean(header));

	const message = `${headers.join("\r\n")}\r\n\r\n${normalizeBody(input.body)}`;

	return Buffer.from(message, "utf8").toString("base64url");
}
