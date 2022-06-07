export type Hotel = {
	id: string,
	name: string,
	address1: string,
	address2?: string,
	starRating: string,
	images: {
		url: string,
		alt?: string
	}[],
	rooms: Room[],
}

export type Room = {
	id: string,
	name: string,
	bedConfiguration: string,
	longDescription: string,
	images: { 
		url: string,
		alt?: string
	}[],
	occupancy: { 
		maxAdults: number,
		maxChildren: number
	}
}

export interface HomePageProps {
	hotelsData: Hotel[],
}

export interface IFilters {
	[k: string]: number,
	rating: number,
	adults: number,
	children: number,
}