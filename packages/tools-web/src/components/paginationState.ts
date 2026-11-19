export function getPaginationState(currentPage: number, limit: number, itemCount: number, totalCount?: number) {
	const totalPages = totalCount === undefined ? undefined : Math.max(1, Math.ceil(totalCount / limit));
	return {totalPages, hasNextPage: totalPages === undefined ? itemCount === limit : currentPage < totalPages};
}
