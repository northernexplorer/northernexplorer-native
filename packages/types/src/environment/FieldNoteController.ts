export type FieldNoteType = {title: string; body: string};

export const FieldNoteController = {
	getFieldNoteData: {
		params: {lat: 0, lon: 0} as {lat: number; lon: number},
		response: null as unknown as FieldNoteType,
	},
};
