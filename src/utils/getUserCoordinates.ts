export const getUserCoordinates = (): Promise<{ latitude: number, longitude: number }> => {

    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude })
            }, (error) => reject(new Error("Failed to get location: " + error.message)));
        }
    })
}