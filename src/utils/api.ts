import ky from 'ky';

export const api = ky.extend({
    prefixUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include', 
    hooks: {
        afterResponse: [
            async (request, options, response) => {
                if (response.status === 401) {
                    try {
                        await api.post(`jwt/refresh/`)

                        const relativeUrl = request.url.replace(process.env.NEXT_PUBLIC_API_URL+'/', '');

                        // Réessaie la requête originale avec le nouveau token
                        const retryResponse = await api(relativeUrl, {
                            ...options,
                            headers: {
                                ...options.headers,
                            },
                        });

                        return retryResponse;
                    } catch (error) {
                        console.error('Error refreshing token', error);
                        throw error; 
                    }
                }

                return response;
            }
        ]
    }
});

export default api;
