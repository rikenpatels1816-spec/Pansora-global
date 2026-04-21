import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0); // 🔥 trigger re-fetch

  const user = JSON.parse(sessionStorage.getItem("user"));

  async function fetchWishlist() {
    if (!user?.Cust_Code) {
      setWishlistCount(0);
      return;
    }

    try {
      const res = await fetch(
        `https://apis.ganeshinfotech.org/api/wishlist/GetWishlist/${user.Cust_Code}`
      );

      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : [];

      setWishlistCount(list.length);

    } catch (err) {
      console.error(err);
      setWishlistCount(0);
    }
  }

  // 🔥 RUN WHEN USER OR REFRESH CHANGES
  useEffect(() => {
    fetchWishlist();
  }, [refreshKey, user]);

  // 🔥 CALL THIS ANYWHERE TO UPDATE
  function refreshWishlist() {
    setRefreshKey(prev => prev + 1);
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        setWishlistCount,
        fetchWishlist,
        refreshWishlist // 🔥 expose this
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}