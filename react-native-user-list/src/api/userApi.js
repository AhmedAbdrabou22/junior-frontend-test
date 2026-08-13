const BASE_URL = "https://jsonplaceholder.typicode.com/users";


export const PAGE_SIZE = 5;


export function transformAddress(address) {
  if (!address) return "";
  const { street, city, zipcode } = address;
  return [street, city, zipcode].filter(Boolean).join(", ");
}


function normalizeUser(rawUser) {
  return {
    id: rawUser.id,
    name: rawUser.name,
    email: rawUser.email,
    address: transformAddress(rawUser.address),
  };
}


export async function fetchUsersPage(page = 1, limit = PAGE_SIZE) {
  const url = `${BASE_URL}?_page=${page}&_limit=${limit}`;
  const response = await fetch(url);



  if (!response.ok) {
    throw new Error(`Failed to fetch users: HTTP ${response.status}`);
  }

  const data = await response.json();
  console.log(data)

  const totalCountHeader = response.headers.get("x-total-count");
  const totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : null;

  return {
    users: data.map(normalizeUser),
    totalCount,
  };
}
