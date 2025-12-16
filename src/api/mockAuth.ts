
export const MOCK_TOKEN = 'token12345';

export const TOKEN_EXPIRY_SECONDS = 300;

export const login = async (username: string, password: string): Promise<{ token: string; expiry: number }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            if (username && password === 'password') {
                const now = Math.floor(Date.now() / 1000);
                resolve({
                    token: MOCK_TOKEN,
                    expiry: now + TOKEN_EXPIRY_SECONDS,
                });
            } else {
                reject(new Error('Invalid credentials (try password="password")'));
            }
        }, 1000); 
    });
};
