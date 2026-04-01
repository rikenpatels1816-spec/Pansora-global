const BASE_URL = "http://192.168.1.131:3000/api/Home";

export async function getCategories() {
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
  const res = await fetch(`${BASE_URL}/Items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({})
  });

  const data = await res.json();

  return Array.isArray(data) ? data : data.data || [];
}