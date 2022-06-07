import { Hotel } from "../types/types";

export async function getHotelsData(collectionId: string = "OBMNG") {
    const res = await fetch(`https://obmng.dbm.guestline.net/api/hotels?collection-id=${collectionId}`);
    const hotelsData = await res.json();

    const hotelIds: string[] = hotelsData.map((hotel: Hotel) => hotel.id);

    await Promise.all(hotelIds.map(async (hotelId) => {
        const res = await fetch(`https://obmng.dbm.guestline.net/api/roomRates/${collectionId}/${hotelId}`);
        const hotelData = await res.json();

        const hotel: Hotel = hotelsData.find((hotel: Hotel) => hotel.id === hotelId);
        hotel.rooms = hotelData.rooms;
    }));

    return hotelsData;
}