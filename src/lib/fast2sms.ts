
export async function sendFast2SMS(phoneNumber: string, otp: string) {
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
        console.warn("FAST2SMS_API_KEY is not set. OTP will be logged only.");
        console.log(`[MOCK OTP] Sending ${otp} to ${phoneNumber}`);
        return { success: true, message: "Mock OTP sent" };
    }

    try {
        const url = "https://www.fast2sms.com/dev/bulkV2";
        const body = {
            route: "otp",
            variables_values: otp,
            numbers: phoneNumber,
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "authorization": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (data.return) {
            return { success: true, message: "OTP sent successfully" };
        } else {
            console.error("Fast2SMS Error:", data);
            return { success: false, message: data.message || "Failed to send OTP" };
        }
    } catch (error) {
        console.error("Fast2SMS Exception:", error);
        return { success: false, message: "Failed to send OTP" };
    }
}
