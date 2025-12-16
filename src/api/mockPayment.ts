
export const processPaymentAPI = async (id: string, amount: number): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
        console.log(`[MockAPI] Processing payment ${id} for $${amount}...`);
        setTimeout(() => {
            const isSuccess = Math.random() > 0.1; 
            console.log(`[MockAPI] Payment ${id} finished. Success: ${isSuccess}`);
            resolve({ success: isSuccess });
        }, 2000); // 2 seconds latency
    });
};
