import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const IMAGE_BASE = "https://pansoraglobal.ganeshinfotech.org/Item_Images/Item/";

export default function Wishlist() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmBox, setConfirmBox] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user"));

    const wishlistText = list
        .map((item, i) => `${i + 1}. ${item.Itm_Name} (${item.Itm_Code})`)
        .join("\n");

    useEffect(() => { fetchWishlist(); }, []);

    async function fetchWishlist() {
        if (!user?.Cust_Code) { navigate("/login"); return; }
        try {
            const res = await fetch(`https://apis.ganeshinfotech.org/api/wishlist/GetWishlist/${user.Cust_Code}`);
            const data = await res.json();
            setList(data?.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }

    async function removeItem(Itm_Code) {
        try {
            const res = await fetch(`https://apis.ganeshinfotech.org/api/wishlist/RemoveWishList`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Cust_Code: user.Cust_Code, Itm_Code }),
            });
            const data = await res.json();
            if (data?.success) setList(prev => prev.filter(i => i.Itm_Code !== Itm_Code));
        } catch (err) { console.error(err); }
    }

    async function clearWishlist() {
        try {
            const res = await fetch(`https://apis.ganeshinfotech.org/api/wishlist/DeleteWishList`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Cust_Code: user.Cust_Code }),
            });
            const data = await res.json();
            if (data?.success) setList([]);
        } catch (err) { console.error(err); }
    }

    async function handleGetQuote() {
        const user = JSON.parse(sessionStorage.getItem("user"));

        if (!user) {
            navigate("/login");
            return;
        }

        const wishlistText = list
            .map((item, i) => `${i + 1}. ${item.Itm_Name} (${item.Itm_Code})`)
            .join("\n");

        const templateParams = {
            customer_name: user.Cust_Name,
            customer_email: user.Cust_Email,
            message: wishlistText,
        };

        try {
            const res = await emailjs.send(
                "service_vv9r9q3",
                "template_ko3j82v",
                templateParams,
                "09nWHi2weMuj-prpZ"
            );

            console.log(res);

            alert("Quote request sent successfully 📩");

        } catch (err) {
            console.error(err);
            alert("Failed to send request ❌");
        }
    }

    if (loading) return (
        <div className="wl-loading">
            <div className="wl-spinner" />
            <p>Loading your wishlist…</p>
        </div>
    );

    if (list.length === 0) return (
        <div className="wl-empty">
            <div className="wl-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            </div>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love and come back to them anytime.</p>
            <button className="wl-explore-btn" onClick={() => navigate("/")}>
                Explore Products
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );

    return (
        <div className="wl-page">

            {/* Header */}
            <div className="wl-header">
                <div className="wl-title">
                    <h2>Wishlist</h2>
                    <span className="wl-count">{list.length} {list.length === 1 ? "item" : "items"}</span>
                </div>
                <div className="wl-header-actions">
                    <button className="wl-clear-btn" onClick={() => setConfirmBox({ type: "all" })}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                        </svg>
                        Remove All
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="wl-grid">
                {list.map((item, i) => (
                    <div className="wl-card" key={i}>

                        {/* Image */}
                        <div className="wl-img-wrap">
                            {item.Item_Images?.[0] ? (
                                <img
                                    src={IMAGE_BASE + item.Item_Images[0]}
                                    alt={item.Itm_Name}
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.parentNode.querySelector(".no-image-box").style.display = "flex";
                                    }}
                                />
                            ) : null}

                            {/* Custom No Image UI */}
                            <div
                                className="no-image-box"
                                style={{
                                    display: item.Item_Images?.[0] ? "none" : "flex",
                                    width: "100%",
                                    height: "140px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    gap: 8,
                                    color: "var(--ink-muted)",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 12
                                }}
                            >
                                <span style={{ fontSize: 36, opacity: 0.4 }}>⊟</span>
                                <span style={{ color: "var(--ink)" }}>No Image</span>
                            </div>
                        </div>
                        {/* Body */}
                        <div className="wl-body">
                            <h4 className="wl-name">{item.Itm_Name}</h4>
                            <span className="wl-code">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <path d="M9 9h6M9 12h6M9 15h4" />
                                </svg>
                                {item.Itm_Code}
                            </span>
                        </div>

                        {/* Actions — View + Remove only */}
                        <div className="wl-actions">
                            <button className="wl-btn wl-btn-outline" onClick={() => navigate(`/productdetails/${item.Itm_Code}`)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                View
                            </button>
                            <button className="wl-btn wl-btn-danger" onClick={() => setConfirmBox({ type: "single", code: item.Itm_Code })} title="Remove">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M9 6V4h6v2" />
                                </svg>
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            {/* Sticky footer — universal Get Quote */}
            <div className="wl-footer">
                <p className="wl-footer-note">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4M12 16h.01" />
                    </svg>
                    Requesting a quote for all {list.length} {list.length === 1 ? "item" : "items"} in your wishlist
                </p>
                <button className="wl-quote-btn wl-quote-btn-lg" onClick={handleGetQuote}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Get Quote for All Items
                </button>
            </div>

            {confirmBox && (
                <div className="confirmOverlay">
                    <div className="confirmBox">

                        <h3>
                            {confirmBox.type === "all"
                                ? "Remove all items?"
                                : "Remove this item?"}
                        </h3>

                        <div className="confirmActions">
                            <button style={{ border: "1px solid #aaa" }} onClick={() => setConfirmBox(null)}>Cancel</button>

                            <button
                                className="danger"
                                onClick={() => {
                                    if (confirmBox.type === "all") {
                                        clearWishlist();
                                    } else {
                                        removeItem(confirmBox.code);
                                    }
                                    setConfirmBox(null);
                                }}
                            >
                                Yes, Remove
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>


    );
}