const paginationHelper = (limit, page, sortBy, sortOrder) => {
  const paginationPage = page && (Number.isInteger(Number(page)) && page > 0) ? page - 1 : 0;

  const paginationLimit = limit && (Number.isInteger(Number(limit)) && limit > 0) ? limit : 10;

  const paginationOffset = paginationLimit * paginationPage;

  const sortField = ['title', 'description', 'created_at'].includes(sortBy) ? sortBy : 'createdAt';
  const paginationOrder = sortOrder && sortOrder.toLowerCase() === 'asc'
    ? { [sortField || 'createdAt']: 'asc' }
    : { [sortField || 'createdAt']: 'desc' };

  return { paginationPage, paginationLimit, paginationOffset, paginationOrder };
};

export default paginationHelper;
