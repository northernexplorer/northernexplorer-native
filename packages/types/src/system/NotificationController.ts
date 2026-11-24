export interface NotificationType {
	id: string;
	title: string;
	message: string;
	link: string | null;
	createdAt: string | Date;
	readAt: string | Date | null;
}

export const NotificationController = {
	getAllPaginated: {
		params: {} as {limit?: number; offset?: number},
		response: {} as {items: NotificationType[]; totalCount: number},
	},
	markRead: {
		params: {} as {id: string},
		response: {} as {success: boolean},
	},
};
