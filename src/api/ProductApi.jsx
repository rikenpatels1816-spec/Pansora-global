const BASE_URL = "https://apis.ganeshinfotech.org/api/Home";

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({})
  });

  const data = await res.json();

  return Array.isArray(data) ? data : data.data || [];
}

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({})
  });

  const data = await res.json();

  // ✅ handle both array & wrapped response
  return Array.isArray(data) ? data : data.data || [];
}

export async function getTopSelling() {
  const res = await fetch(`${BASE_URL}/TopSelling`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({})
  });

  const data = await res.json();

  return Array.isArray(data) ? data : data.data || [];
}
export async function getProductById(id) {
  const res = await fetch(`${BASE_URL}/GetOnItem/${id}`);

  const data = await res.json();

  return Array.isArray(data)
    ? data[0]
    : data?.data?.[0] || data;
}

export async function getSubCategories(categoryId) {
  const res = await fetch(
    `https://apis.ganeshinfotech.org/api/Home/GetOnCategory/${categoryId}`,
    {
      method: "GET"
    }
  );

  const data = await res.json();

  return Array.isArray(data) ? data : data?.data || [];
}

export async function getProductsBySubCategory(subId) {
  const res = await fetch(`${BASE_URL}/GetOnSubCategory/${subId}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data?.data || [];
}