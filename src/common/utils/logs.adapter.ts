export const logsAdapter = {
	info(context: string, message: string) {
		console.info(`[INFO] [${context}] ${message}`)
	},
	success(context: string, message: string) {
		console.log(`[SUCCESS] [${context}] ${message}`)
	},
	warn(context: string, message: string) {
		console.warn(`[WARN] [${context}] ${message}`)
	},
	error(context: string, message: string) {
		console.error(`[ERROR] [${context}] ${message}`)
	},
}
