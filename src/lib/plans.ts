export const PLANS = {
	free: {
		maxConnectedAccounts: 1,

		maxEmails: 10,
		realtimeSync: false,
		manualSyncCooldownHours: 6,

		aiActionsPerMonth: 20,

		voiceMode: false,
		meetingScheduling: false,
		followUps: false,

		prioritySupport: false,
		advancedAutomations: false,
	},

	pro: {
		maxConnectedAccounts: 3,

		maxEmails: 1000,
		realtimeSync: true,
		manualSyncCooldownHours: 0,

		aiActionsPerMonth: 300,

		voiceMode: true,
		meetingScheduling: true,
		followUps: true,

		prioritySupport: false,
		advancedAutomations: false,
	},

	pro_plus: {
		maxConnectedAccounts: 5,

		maxEmails: 10000,
		realtimeSync: true,
		manualSyncCooldownHours: 0,

		aiActionsPerMonth: 2000,

		voiceMode: true,
		meetingScheduling: true,
		followUps: true,

		prioritySupport: true,
		advancedAutomations: true,
	},
} as const;
