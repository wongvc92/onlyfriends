const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const basePath = (value = "") => {
  console.log("BASE_URL", BASE_URL);
  return `${BASE_URL}${value}`;
};

interface SearchParamsProps {
  [key: string]: string | string[] | undefined;
}
export const buildSearchParams = (searchParams: SearchParamsProps) => {
  let params = "";
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        params += `&${encodeURIComponent(key)}=${encodeURIComponent(item)}`;
      }
    }

    if (value !== undefined) {
      params += `&${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`;
    }
  }
  return params.length > 0 ? `?${params.slice(1)}` : "";
};
