interface SearchParamsProps {
  [key: string]: string | string[] | number | undefined;
}
export const buildSearchParams = (searchParams: SearchParamsProps) => {
  let params = "";
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        params += `&${encodeURIComponent(key)}=${encodeURIComponent(item.toString())}`;
      }
    }

    if (value !== undefined) {
      params += `&${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`;
    }
  }
  return params.length > 0 ? `?${params.slice(1)}` : "";
};
