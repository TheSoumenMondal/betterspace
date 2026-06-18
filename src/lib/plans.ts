export const PLANS = {
	free: {
		name: "Free",
		description:
			"Perfect for getting started and organizing your personal inbox.",
		price: {
			monthly: {
				usd: "$0",
				inr: "₹0",
				usdAmount: 0,
				inrAmount: 0,
			},
		},
		maxConnectedAccounts: 1,
		maxEmails: 50,
		realtimeSync: false,
		manualSyncCooldownHours: 6,
		aiMessagesPerMonth: 10,
		aiInsights: true,
		voiceMode: false,
		meetingScheduling: false,
		followUps: false,
		advancedSearch: false,
		webhooks: false,
		prioritySupport: false,
		advancedAutomations: false,
	},

	pro: {
		name: "Pro",
		description:
			"For professionals who need more power and seamless synchronization.",
		price: {
			monthly: {
				usd: "$9",
				inr: "₹799",
				usdAmount: 9,
				inrAmount: 799,
			},
		},
		maxConnectedAccounts: 3,
		maxEmails: 1000,
		realtimeSync: true,
		manualSyncCooldownHours: 0,
		aiMessagesPerMonth: 300,
		aiInsights: true,
		voiceMode: true,
		meetingScheduling: true,
		followUps: true,
		advancedSearch: true,
		webhooks: true,
		prioritySupport: false,
		advancedAutomations: false,
	},

	pro_plus: {
		name: "Pro Plus",
		description:
			"For power users demanding ultimate control and advanced AI features.",
		price: {
			monthly: {
				usd: "$19",
				inr: "₹1699",
				usdAmount: 35,
				inrAmount: 2999,
			},
		},
		maxConnectedAccounts: 5,
		maxEmails: 10000,
		realtimeSync: true,
		manualSyncCooldownHours: 0,
		aiMessagesPerMonth: 2000,
		aiInsights: true,
		voiceMode: true,
		meetingScheduling: true,
		followUps: true,
		advancedSearch: true,
		webhooks: true,
		prioritySupport: true,
		advancedAutomations: true,
	},
} as const;
