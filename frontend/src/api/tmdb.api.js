const search = async ({ query, page = 1 }) => {
  const response = await axiosClient.get(
    `/search/multi?query=${query}&page=${page}`
  );

  return response.data;
};

export default {
  search,
};