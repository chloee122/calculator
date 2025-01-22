export const getUserCoordinates = (): Promise<{ latitude: number, longitude: number }> => {

    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser."))
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude })
        }, (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                reject(new Error("Please turn on location sharing in your browser's settings."))
                return;
            }

            reject(new Error("Failed to get location: " + error.message))
        });
    })
}