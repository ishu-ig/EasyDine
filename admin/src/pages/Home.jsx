import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend,
    AreaChart, Area,
} from "recharts";

import { getMaincategory } from "../Redux/ActionCreators/MaincategoryActionCreators";
import { getSubcategory }  from "../Redux/ActionCreators/SubcategoryActionCreators";
import { getProduct }      from "../Redux/ActionCreators/ProductActionCreators";
import { getResturent }    from "../Redux/ActionCreators/ResturentActionCreators";
import { getTestimonial }  from "../Redux/ActionCreators/TestimonialActionCreators";
import { getNewsletter }   from "../Redux/ActionCreators/NewsletterActionCreators";
import { getContactUs }    from "../Redux/ActionCreators/ContactUsActionCreators";
import { getCheckout }     from "../Redux/ActionCreators/CheckoutActionCreators";
import { getBooking }      from "../Redux/ActionCreators/BookingActionCreators";

const SAMPLE = {
    checkouts: [
        { _id:"c1", user:{ name:"Rahul Sharma" },  paymentMode:"UPI",  subtotal:480,  deliveryCharge:40,  total:520,  orderStatus:"Delivered",        paymentStatus:"Done",    createdAt:"2025-04-01" },
        { _id:"c2", user:{ name:"Priya Mehta" },   paymentMode:"COD",  subtotal:310,  deliveryCharge:30,  total:340,  orderStatus:"Processing",       paymentStatus:"Pending", createdAt:"2025-04-10" },
        { _id:"c3", user:{ name:"Aakash Singh" },  paymentMode:"Card", subtotal:750,  deliveryCharge:50,  total:800,  orderStatus:"Out for Delivery", paymentStatus:"Done",    createdAt:"2025-04-18" },
        { _id:"c4", user:{ name:"Sneha Patel" },   paymentMode:"UPI",  subtotal:200,  deliveryCharge:20,  total:220,  orderStatus:"Order Is Placed",  paymentStatus:"Pending", createdAt:"2025-05-01" },
        { _id:"c5", user:{ name:"Vikram Nair" },   paymentMode:"COD",  subtotal:640,  deliveryCharge:40,  total:680,  orderStatus:"Cancelled",        paymentStatus:"Pending", createdAt:"2025-05-02" },
        { _id:"c6", user:{ name:"Anjali Rao" },    paymentMode:"UPI",  subtotal:920,  deliveryCharge:60,  total:980,  orderStatus:"Delivered",        paymentStatus:"Done",    createdAt:"2025-03-15" },
        { _id:"c7", user:{ name:"Deepak Kumar" },  paymentMode:"Card", subtotal:550,  deliveryCharge:50,  total:600,  orderStatus:"Delivered",        paymentStatus:"Done",    createdAt:"2025-02-20" },
    ],
    bookings: [
        { _id:"b1", user:{ name:"Rahul Sharma" },  resturent:{ name:"Spice Garden" },   date:"2025-05-10", time:"7:00 PM", seats:2, total:800,  paymentStatus:"Done",    bookingStatus:true  },
        { _id:"b2", user:{ name:"Priya Mehta" },   resturent:{ name:"The Tandoor" },    date:"2025-05-11", time:"8:30 PM", seats:4, total:1600, paymentStatus:"Pending", bookingStatus:true  },
        { _id:"b3", user:{ name:"Aakash Singh" },  resturent:{ name:"Saffron Lounge" }, date:"2025-05-12", time:"7:30 PM", seats:2, total:900,  paymentStatus:"Done",    bookingStatus:false },
        { _id:"b4", user:{ name:"Sneha Patel" },   resturent:{ name:"Spice Garden" },   date:"2025-05-14", time:"1:00 PM", seats:6, total:2400, paymentStatus:"Pending", bookingStatus:true  },
        { _id:"b5", user:{ name:"Anjali Rao" },    resturent:{ name:"The Tandoor" },    date:"2025-05-15", time:"8:00 PM", seats:3, total:1200, paymentStatus:"Done",    bookingStatus:true  },
    ],
    resturents:     [
        { name:"Spice Garden",   status:true },
        { name:"The Tandoor",    status:true },
        { name:"Saffron Lounge", status:false },
        { name:"Royal Feast",    status:true },
        { name:"Biryani House",  status:true },
        { name:"Curry Kingdom",  status:false },
    ],
    products: [
        { name:"Paneer Tikka",    resturent:{ name:"Spice Garden" },   availability:true  },
        { name:"Dal Makhani",     resturent:{ name:"Spice Garden" },   availability:true  },
        { name:"Butter Chicken",  resturent:{ name:"The Tandoor" },    availability:true  },
        { name:"Garlic Naan",     resturent:{ name:"The Tandoor" },    availability:false },
        { name:"Biryani Special", resturent:{ name:"Biryani House" },  availability:true  },
        { name:"Mutton Rogan",    resturent:{ name:"Saffron Lounge" }, availability:true  },
        { name:"Veg Thali",       resturent:{ name:"Royal Feast" },    availability:false },
        { name:"Fish Curry",      resturent:{ name:"Curry Kingdom" },  availability:true  },
    ],
    maincategories: [{ name:"Veg" },{ name:"Non-Veg" },{ name:"Beverages" },{ name:"Desserts" }],
    subcategories:  [{ name:"Starters" },{ name:"Main Course" },{ name:"Breads" },{ name:"Drinks" },{ name:"Sweets" }],
    newsletters:    Array(15).fill(null).map((_,i)=>({ _id:`nl${i}` })),
    testimonials:   Array(6).fill(null).map((_,i)=>({ _id:`t${i}` })),
    contacts:       [{ active:true },{ active:true },{ active:false },{ active:true },{ active:false }],
};

const DashTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background:"#161D2F", border:"1px solid rgba(79,142,247,0.25)",
            borderRadius:"10px", padding:"10px 14px", fontSize:"12.5px", lineHeight:1.8
        }}>
            {label && <p style={{ color:"#8896B3", marginBottom:"4px", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</p>}
            {payload.map((p,i) => (
                <p key={i} style={{ color: p.color || p.fill || "#EEF2FF", margin:0 }}>
                    {p.name}: <strong style={{ color:"#EEF2FF" }}>
                        {p.name?.toLowerCase().includes("revenue") ? "₹"+Number(p.value).toLocaleString("en-IN") : p.value}
                    </strong>
                </p>
            ))}
        </div>
    );
};

// ── Robustly unwrap any Redux slice shape ─────────────────────────────────────
// Handles: array, { data: [] }, { data: { data: [] } }, null/undefined
function unwrap(slice) {
    if (!slice) return [];
    if (Array.isArray(slice)) return slice;
    // { data: [...] }
    if (Array.isArray(slice.data)) return slice.data;
    // { data: { data: [...] } }  — double-wrapped
    if (slice.data && Array.isArray(slice.data.data)) return slice.data.data;
    // { result: [...] } or { records: [...] } — other common keys
    for (const key of ['result','records','items','list']) {
        if (Array.isArray(slice[key])) return slice[key];
    }
    return [];
}

export default function Home() {
    const dispatch = useDispatch();
    const [loaded,      setLoaded]      = useState(false);
    const [usingSample, setUsingSample] = useState(false);

    const raw = {
        maincategories: useSelector(s => s.MaincategoryStateData),
        subcategories:  useSelector(s => s.SubcategoryStateData),
        products:       useSelector(s => s.ProductStateData),
        resturents:     useSelector(s => s.ResturentStateData),
        testimonials:   useSelector(s => s.TestimonialStateData),
        newsletters:    useSelector(s => s.NewsletterStateData),
        contacts:       useSelector(s => s.ContactUsStateData),
        checkouts:      useSelector(s => s.CheckoutStateData),
        bookings:       useSelector(s => s.BookingStateData),
    };

    useEffect(() => {
        dispatch(getMaincategory());
        dispatch(getSubcategory());
        dispatch(getProduct());
        dispatch(getResturent());
        dispatch(getTestimonial());
        dispatch(getNewsletter());
        dispatch(getContactUs());
        dispatch(getCheckout());
        dispatch(getBooking());
        setTimeout(() => setLoaded(true), 600);
    }, []);

    const live = {
        maincategories: unwrap(raw.maincategories),
        subcategories:  unwrap(raw.subcategories),
        products:       unwrap(raw.products),
        resturents:     unwrap(raw.resturents),
        testimonials:   unwrap(raw.testimonials),
        newsletters:    unwrap(raw.newsletters),
        contacts:       unwrap(raw.contacts),
        checkouts:      unwrap(raw.checkouts),
        bookings:       unwrap(raw.bookings),
    };

    const allEmpty = loaded && Object.values(live).every(a => a.length === 0);
    useEffect(() => { if (loaded) setUsingSample(allEmpty); }, [allEmpty, loaded]);

    const D = allEmpty ? SAMPLE : live;

    // ── Derived numbers ───────────────────────────────────────────────────────
    const pendingOrders          = D.checkouts.filter(c => c.orderStatus === "Order Is Placed").length;
    const pendingPayments        = D.checkouts.filter(c => c.paymentStatus === "Pending").length;
    const pendingBookings        = D.bookings.filter(b => b.bookingStatus === true).length;
    const pendingBookingPayments = D.bookings.filter(b => b.paymentStatus === "Pending").length;
    const pendingContacts        = D.contacts.filter(c => c.active).length;

    const checkoutRevenue = D.checkouts.filter(c => c.paymentStatus === "Done").reduce((s,c) => s+(c.total||0), 0);
    const bookingRevenue  = D.bookings.filter(b => b.paymentStatus === "Done").reduce((s,b) => s+(b.total||0), 0);
    const totalRevenue    = checkoutRevenue + bookingRevenue;

    const recentOrders   = [...D.checkouts].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
    const recentBookings = [...D.bookings].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);

    // ── Chart data ────────────────────────────────────────────────────────────
    const orderStatusPie = [
        { name:"Placed",           value: D.checkouts.filter(c => c.orderStatus==="Order Is Placed").length,  color:"#F7C35F" },
        { name:"Processing",       value: D.checkouts.filter(c => c.orderStatus==="Processing").length,       color:"#4F8EF7" },
        { name:"Out for Delivery", value: D.checkouts.filter(c => c.orderStatus==="Out for Delivery").length, color:"#38EFC3" },
        { name:"Delivered",        value: D.checkouts.filter(c => c.orderStatus==="Delivered").length,        color:"#38EF91" },
        { name:"Cancelled",        value: D.checkouts.filter(c => c.orderStatus==="Cancelled").length,        color:"#F75F5F" },
    ].filter(d => d.value > 0);

    const resturentPie = [
        { name:"Open",   value: D.resturents.filter(r => r.status===true).length,  color:"#38EF91" },
        { name:"Closed", value: D.resturents.filter(r => r.status===false).length, color:"#F75F5F" },
    ].filter(d => d.value > 0);

    const revenueSplit = [
        { name:"Order Revenue",   revenue: checkoutRevenue, fill:"#4F8EF7" },
        { name:"Booking Revenue", revenue: bookingRevenue,  fill:"#38EFC3" },
    ];

    const productAvailability = [
        { name:"Available",   count: D.products.filter(p => p.availability===true).length,  fill:"#38EF91" },
        { name:"Unavailable", count: D.products.filter(p => p.availability===false).length, fill:"#F75F5F" },
    ];

    const paymentModeMap = {};
    D.checkouts.forEach(c => { const m=c.paymentMode||"COD"; paymentModeMap[m]=(paymentModeMap[m]||0)+1; });
    const paymentModeData = Object.entries(paymentModeMap).map(([name,count])=>({ name, count }));

    const monthlyMap = {};
    D.checkouts.filter(c=>c.paymentStatus==="Done"&&c.createdAt).forEach(c => {
        const key = new Date(c.createdAt).toLocaleString("en-IN",{month:"short",year:"2-digit"});
        monthlyMap[key]=(monthlyMap[key]||0)+(c.total||0);
    });
    const monthlyRevenue = Object.entries(monthlyMap).slice(-7).map(([month,revenue])=>({ month, revenue }));

    const bookingResturentMap = {};
    D.bookings.forEach(b => { const n=b.resturent?.name||"Unknown"; bookingResturentMap[n]=(bookingResturentMap[n]||0)+1; });
    const bookingsPerResturent = Object.entries(bookingResturentMap).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,count])=>({ name, count }));

    const productResturentMap = {};
    D.products.forEach(p => { const n=p.resturent?.name||"Unknown"; productResturentMap[n]=(productResturentMap[n]||0)+1; });
    const productsPerResturent = Object.entries(productResturentMap).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,count])=>({ name, count }));

    const fmt  = n => "₹"+Number(n).toLocaleString("en-IN");
    const axis = { fontSize:11, fill:"#8896B3" };
    const grid = { stroke:"rgba(255,255,255,0.05)" };

    const orderBadge = s => ({
        "Order Is Placed":  { cls:"hm-badge hm-badge--warn",    label:"Placed"      },
        "Processing":       { cls:"hm-badge hm-badge--info",    label:"Processing"  },
        "Out for Delivery": { cls:"hm-badge hm-badge--teal",    label:"Dispatched"  },
        "Delivered":        { cls:"hm-badge hm-badge--success", label:"Delivered"   },
        "Cancelled":        { cls:"hm-badge hm-badge--danger",  label:"Cancelled"   },
    }[s] || { cls:"hm-badge", label:s||"—" });

    const payBadge = s => ({
        "Done":    "hm-badge hm-badge--success",
        "Pending": "hm-badge hm-badge--warn",
        "Failed":  "hm-badge hm-badge--danger",
    }[s] || "hm-badge");

    const statCards = [
        { label:"Restaurants",     value:D.resturents.length,     icon:"fa-store",          accent:"#4F8EF7", link:"/resturent" },
        { label:"Main Categories", value:D.maincategories.length, icon:"fa-layer-group",    accent:"#38EFC3", link:"/maincategory" },
        { label:"Subcategories",   value:D.subcategories.length,  icon:"fa-list",           accent:"#A78BFA", link:"/subcategory" },
        { label:"Products",        value:D.products.length,       icon:"fa-utensils",       accent:"#F7C35F", link:"/product" },
        { label:"Testimonials",    value:D.testimonials.length,   icon:"fa-star",           accent:"#38EF91", link:"/testimonial" },
        { label:"Newsletters",     value:D.newsletters.length,    icon:"fa-envelope-open",  accent:"#F97316", link:"/newsletter" },
        { label:"Orders",          value:D.checkouts.length,      icon:"fa-receipt",        accent:"#EC4899", link:"/checkout" },
        { label:"Table Bookings",  value:D.bookings.length,       icon:"fa-calendar-check", accent:"#14B8A6", link:"/booking" },
    ];

    const alertCards = [
        { label:"New Orders",       value:pendingOrders,                          icon:"fa-clock",       color:"#F7C35F" },
        { label:"Active Bookings",  value:pendingBookings,                        icon:"fa-chair",       color:"#14B8A6" },
        { label:"Pending Payments", value:pendingPayments+pendingBookingPayments, icon:"fa-credit-card", color:"#F75F5F" },
        { label:"New Messages",     value:pendingContacts,                        icon:"fa-envelope",    color:"#4F8EF7" },
    ];

    return (
        <>
        <style>{`
            .hm-root {
                padding: 28px 24px 80px; max-width: 1280px;
                margin: 0 auto; width: 100%;
                opacity: 0; transform: translateY(14px);
                transition: opacity .45s ease, transform .45s ease;
            }
            .hm-root.hm-loaded { opacity: 1; transform: none; }
            .hm-sample-banner {
                display: flex; align-items: center; gap: 10px;
                background: rgba(247,195,95,0.1);
                border: 1px solid rgba(247,195,95,0.3);
                border-radius: 10px; padding: 10px 16px;
                font-size: 13px; color: #F7C35F; margin-bottom: 20px;
                animation: hmFadeUp .4s ease;
            }
            @keyframes hmFadeUp {
                from { opacity:0; transform:translateY(8px); }
                to   { opacity:1; transform:none; }
            }
            .hm-header {
                display: flex; align-items: flex-start;
                justify-content: space-between; flex-wrap: wrap;
                gap: 12px; margin-bottom: 22px;
            }
            .hm-title {
                font-family: 'Syne', sans-serif;
                font-size: 24px; font-weight: 800;
                color: var(--text-primary); letter-spacing: -.02em; margin: 0;
            }
            .hm-subtitle { font-size: 13px; color: var(--text-secondary); margin: 3px 0 0; }
            .hm-date {
                font-size: 12.5px; color: var(--text-muted);
                background: var(--bg-card); border: 1px solid var(--border);
                border-radius: 8px; padding: 7px 14px;
                display: flex; align-items: center; gap: 7px;
            }
            .hm-rev-banner {
                background: linear-gradient(135deg, #0d1d46 0%, #0a1530 60%, #061020 100%);
                border: 1px solid var(--border-accent);
                border-radius: 16px; padding: 22px 28px;
                margin-bottom: 20px; position: relative; overflow: hidden;
            }
            .hm-rev-banner::before {
                content:''; position:absolute; inset:0;
                background: radial-gradient(ellipse at 10% 50%, rgba(79,142,247,.1) 0%, transparent 60%),
                            radial-gradient(ellipse at 90% 50%, rgba(56,239,195,.07) 0%, transparent 60%);
            }
            .hm-rev-inner {
                display: flex; align-items: center;
                justify-content: space-between; flex-wrap: wrap; gap: 16px; position: relative;
            }
            .hm-rev-label {
                font-size: 12px; text-transform: uppercase; letter-spacing: .08em;
                color: var(--text-secondary); margin-bottom: 6px; font-weight: 700;
            }
            .hm-rev-value {
                font-family: 'Syne', sans-serif;
                font-size: 34px; font-weight: 800;
                color: var(--text-primary); letter-spacing: -.02em;
            }
            .hm-rev-icon {
                width: 54px; height: 54px;
                background: linear-gradient(135deg, var(--accent), #3a7de0);
                border-radius: 14px;
                display: flex; align-items: center; justify-content: center;
                font-size: 22px; color: #fff;
                box-shadow: 0 8px 24px rgba(79,142,247,.4);
            }
            .hm-rev-sub {
                display: flex; align-items: center; flex-wrap: wrap; gap: 20px;
                margin-top: 14px; padding-top: 14px;
                border-top: 1px solid rgba(255,255,255,.06); position: relative;
            }
            .hm-rev-sub span { font-size: 12.5px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; }
            .hm-rev-sub span i { color: var(--accent); }
            .hm-stat-grid {
                display: grid; grid-template-columns: repeat(4, 1fr);
                gap: 14px; margin-bottom: 14px;
            }
            .hm-stat-card {
                background: var(--bg-surface); border: 1px solid var(--border);
                border-radius: 14px; padding: 16px 18px;
                display: flex; align-items: center; gap: 14px;
                text-decoration: none; transition: var(--transition);
                animation: hmFadeUp .4s ease both;
                position: relative; overflow: hidden;
            }
            .hm-stat-card::after {
                content:''; position:absolute; bottom:0; left:0; right:0; height: 2px;
                background: var(--card-accent, var(--accent));
                transform: scaleX(0); transform-origin: left; transition: transform .3s ease;
            }
            .hm-stat-card:hover { background: var(--bg-hover); transform: translateY(-2px); }
            .hm-stat-card:hover::after { transform: scaleX(1); }
            .hm-stat-icon {
                width: 42px; height: 42px; border-radius: 11px;
                display: flex; align-items: center; justify-content: center;
                font-size: 16px; flex-shrink: 0;
            }
            .hm-stat-value {
                font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800;
                color: var(--text-primary); display: block; line-height: 1;
            }
            .hm-stat-label { font-size: 11.5px; color: var(--text-secondary); display: block; margin-top: 3px; font-weight: 600; }
            .hm-stat-arrow { margin-left: auto; color: var(--text-muted); font-size: 12px; }
            .hm-alert-grid {
                display: grid; grid-template-columns: repeat(4, 1fr);
                gap: 14px; margin-bottom: 20px;
            }
            .hm-alert-card {
                background: var(--bg-surface); border: 1px solid var(--border);
                border-radius: 12px; padding: 14px 16px;
                display: flex; align-items: center; gap: 12px;
                animation: hmFadeUp .4s ease both;
            }
            .hm-alert-val { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; line-height: 1; }
            .hm-alert-lbl { font-size: 12px; color: var(--text-secondary); font-weight: 600; }
            .hm-card {
                background: var(--bg-surface); border: 1px solid var(--border);
                border-radius: 14px; padding: 20px; animation: hmFadeUp .45s ease both;
            }
            .hm-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
            .hm-card-title {
                font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
                color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 8px;
            }
            .hm-card-title i { color: var(--accent); font-size: 13px; }
            .hm-card-link { font-size: 12px; color: var(--accent); text-decoration: none; font-weight: 600; transition: color .2s; }
            .hm-card-link:hover { color: var(--accent-2); }
            .hm-empty { font-size: 13px; color: var(--text-muted); text-align: center; padding: 28px 0; font-style: italic; }
            .hm-chart-note {
                font-size: 11px; color: var(--text-muted);
                background: var(--bg-card); border: 1px solid var(--border);
                border-radius: 6px; padding: 3px 9px;
            }
            .hm-row-wide   { display: grid; grid-template-columns: 1.6fr 1fr; gap: 16px; margin-bottom: 16px; }
            .hm-row-three  { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
            .hm-row-single { margin-bottom: 16px; }
            .hm-row-mid    { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px; }
            .hm-row-bottom { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-bottom: 16px; }
            .hm-table-wrap { overflow-x: auto; margin: 0 -4px; padding: 0 4px; }
            .hm-table { width: 100%; border-collapse: collapse; font-size: 13px; color: var(--text-secondary); }
            .hm-table thead tr th {
                background: var(--bg-card); color: var(--text-muted); font-size: 10.5px;
                text-transform: uppercase; letter-spacing: .07em; font-weight: 700;
                padding: 10px 14px; border-bottom: 1px solid var(--border); white-space: nowrap;
            }
            .hm-table tbody tr { border-bottom: 1px solid var(--border); transition: background .15s; }
            .hm-table tbody tr:last-child { border-bottom: none; }
            .hm-table tbody tr:hover { background: var(--bg-hover); }
            .hm-table tbody td { padding: 11px 14px; vertical-align: middle; color: var(--text-secondary); white-space: nowrap; }
            .hm-table tbody tr:hover td { color: var(--text-primary); }
            .hm-badge {
                display: inline-block; padding: 3px 10px; border-radius: 20px;
                font-size: 11px; font-weight: 700;
                background: var(--bg-card); color: var(--text-muted); border: 1px solid var(--border);
            }
            .hm-badge--success { background:rgba(56,239,145,.12); color:#38EF91; border-color:rgba(56,239,145,.25); }
            .hm-badge--warn    { background:rgba(247,195,95,.12);  color:#F7C35F; border-color:rgba(247,195,95,.25); }
            .hm-badge--info    { background:rgba(79,142,247,.12);  color:#4F8EF7; border-color:rgba(79,142,247,.25); }
            .hm-badge--teal    { background:rgba(56,239,195,.12);  color:#38EFC3; border-color:rgba(56,239,195,.25); }
            .hm-badge--danger  { background:rgba(247,95,95,.12);   color:#F75F5F; border-color:rgba(247,95,95,.25);  }
            .hm-quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
            .hm-quick-btn {
                display: flex; align-items: center; gap: 10px;
                background: var(--bg-card); border: 1px solid var(--border);
                border-radius: 10px; padding: 10px 12px;
                color: var(--text-secondary); font-size: 12.5px; font-weight: 600;
                text-decoration: none; transition: var(--transition);
                border-left: 3px solid var(--q-color, var(--accent));
            }
            .hm-quick-btn:hover { background: var(--bg-hover); color: var(--text-primary); transform: translateX(2px); }
            .hm-quick-btn i { font-size: 13px; width: 16px; text-align: center; }
            @media (max-width: 900px) {
                .hm-stat-grid  { grid-template-columns: repeat(2,1fr); }
                .hm-alert-grid { grid-template-columns: repeat(2,1fr); }
                .hm-row-wide   { grid-template-columns: 1fr; }
                .hm-row-three  { grid-template-columns: 1fr 1fr; }
                .hm-row-bottom { grid-template-columns: 1fr; }
            }
            @media (max-width: 600px) {
                .hm-stat-grid  { grid-template-columns: repeat(2,1fr); }
                .hm-alert-grid { grid-template-columns: repeat(2,1fr); }
                .hm-row-three  { grid-template-columns: 1fr; }
                .hm-rev-value  { font-size: 26px; }
            }
        `}</style>

        <div className={`hm-root ${loaded ? "hm-loaded" : ""}`}>

            {usingSample && (
                <div className="hm-sample-banner">
                    <i className="fas fa-flask"></i>
                    <strong>Preview mode —</strong> showing sample data because the API returned no records.
                </div>
            )}

            <div className="hm-header">
                <div>
                    <h1 className="hm-title p-2 bg-primary text-light">Dashboard</h1>
                    <p className="hm-subtitle">Welcome back, Admin — here's what's happening today.</p>
                </div>
                <span className="hm-date">
                    <i className="fas fa-calendar-alt"></i>
                    {new Date().toLocaleDateString("en-IN",{ weekday:"long", year:"numeric", month:"long", day:"numeric" })}
                </span>
            </div>

            <div className="hm-rev-banner">
                <div className="hm-rev-inner">
                    <div>
                        <p className="hm-rev-label">Total Revenue Collected</p>
                        <p className="hm-rev-value">{fmt(totalRevenue)}</p>
                    </div>
                    <div className="hm-rev-icon"><i className="fas fa-rupee-sign"></i></div>
                </div>
                <div className="hm-rev-sub">
                    <span><i className="fas fa-shopping-bag"></i> Orders: <strong>{fmt(checkoutRevenue)}</strong></span>
                    <span><i className="fas fa-calendar-check"></i> Bookings: <strong>{fmt(bookingRevenue)}</strong></span>
                    <span><i className="fas fa-exclamation-circle"></i> {pendingPayments+pendingBookingPayments} payments pending</span>
                </div>
            </div>

            <div className="hm-stat-grid">
                {statCards.map((c,i) => (
                    <Link to={c.link} key={i} className="hm-stat-card"
                        style={{ "--card-accent":c.accent, animationDelay:`${i*.05}s` }}>
                        <div className="hm-stat-icon" style={{ background:c.accent+"22", color:c.accent }}>
                            <i className={`fas ${c.icon}`}></i>
                        </div>
                        <div>
                            <span className="hm-stat-value">{c.value}</span>
                            <span className="hm-stat-label">{c.label}</span>
                        </div>
                        <div className="hm-stat-arrow"><i className="fas fa-arrow-right"></i></div>
                    </Link>
                ))}
            </div>

            <div className="hm-alert-grid">
                {alertCards.map((c,i) => (
                    <div key={i} className="hm-alert-card" style={{ animationDelay:`${.4+i*.07}s` }}>
                        <i className={`fas ${c.icon}`} style={{ color:c.color, fontSize:18 }}></i>
                        <div>
                            <div className="hm-alert-val" style={{ color:c.color }}>{c.value}</div>
                            <div className="hm-alert-lbl">{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hm-row-wide">
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-chart-area"></i> Monthly Revenue Trend</h2>
                        <span className="hm-chart-note">Completed orders</span>
                    </div>
                    {monthlyRevenue.length === 0
                        ? <p className="hm-empty">No revenue data yet.</p>
                        : <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={monthlyRevenue} margin={{ top:10, right:10, left:0, bottom:0 }}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#4F8EF7" stopOpacity={0.35}/>
                                        <stop offset="95%" stopColor="#4F8EF7" stopOpacity={0.02}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" {...grid}/>
                                <XAxis dataKey="month" tick={axis} axisLine={false} tickLine={false}/>
                                <YAxis tick={axis} axisLine={false} tickLine={false}
                                    tickFormatter={v=>"₹"+(v>=1000?(v/1000).toFixed(0)+"k":v)}/>
                                <Tooltip content={<DashTooltip/>}/>
                                <Area type="monotone" dataKey="revenue" name="Revenue"
                                    stroke="#4F8EF7" strokeWidth={2.5} fill="url(#revGrad)"
                                    dot={{ fill:"#4F8EF7", r:4, strokeWidth:0 }}
                                    activeDot={{ r:6, fill:"#7FB3FF" }}/>
                            </AreaChart>
                        </ResponsiveContainer>
                    }
                </div>
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-chart-pie"></i> Order Status</h2>
                        <Link to="/checkout" className="hm-card-link">View all</Link>
                    </div>
                    {orderStatusPie.length === 0
                        ? <p className="hm-empty">No orders yet.</p>
                        : <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={orderStatusPie} dataKey="value" nameKey="name"
                                    cx="50%" cy="50%" innerRadius={50} outerRadius={78}
                                    paddingAngle={3} strokeWidth={0}>
                                    {orderStatusPie.map((e,i) => <Cell key={i} fill={e.color}/>)}
                                </Pie>
                                <Tooltip content={<DashTooltip/>}/>
                                <Legend iconType="circle" iconSize={8}
                                    formatter={v=><span style={{ fontSize:11, color:"#8896B3" }}>{v}</span>}/>
                            </PieChart>
                        </ResponsiveContainer>
                    }
                </div>
            </div>

            <div className="hm-row-three">
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-chart-bar"></i> Revenue Split</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={revenueSplit} margin={{ top:10, right:10, left:0, bottom:0 }} barSize={44}>
                            <CartesianGrid strokeDasharray="3 3" {...grid}/>
                            <XAxis dataKey="name" tick={{ ...axis, fontSize:10 }} axisLine={false} tickLine={false}/>
                            <YAxis tick={axis} axisLine={false} tickLine={false}
                                tickFormatter={v=>"₹"+(v>=1000?(v/1000).toFixed(0)+"k":v)}/>
                            <Tooltip content={<DashTooltip/>}/>
                            <Bar dataKey="revenue" name="Revenue" radius={[6,6,0,0]}>
                                {revenueSplit.map((e,i) => <Cell key={i} fill={e.fill}/>)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-credit-card"></i> Payment Modes</h2>
                    </div>
                    {paymentModeData.length === 0
                        ? <p className="hm-empty">No data yet.</p>
                        : <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={paymentModeData} margin={{ top:10, right:10, left:0, bottom:0 }} barSize={36}>
                                <CartesianGrid strokeDasharray="3 3" {...grid}/>
                                <XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false}/>
                                <YAxis tick={axis} axisLine={false} tickLine={false} allowDecimals={false}/>
                                <Tooltip content={<DashTooltip/>}/>
                                <Bar dataKey="count" name="Orders" fill="#A78BFA" radius={[6,6,0,0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    }
                </div>
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-store"></i> Restaurant Status</h2>
                        <Link to="/resturent" className="hm-card-link">View all</Link>
                    </div>
                    {resturentPie.length === 0
                        ? <p className="hm-empty">No restaurants yet.</p>
                        : <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={resturentPie} dataKey="value" nameKey="name"
                                    cx="50%" cy="44%" outerRadius={70} paddingAngle={4} strokeWidth={0}>
                                    {resturentPie.map((e,i) => <Cell key={i} fill={e.color}/>)}
                                </Pie>
                                <Tooltip content={<DashTooltip/>}/>
                                <Legend iconType="circle" iconSize={8}
                                    formatter={v=><span style={{ fontSize:11, color:"#8896B3" }}>{v}</span>}/>
                            </PieChart>
                        </ResponsiveContainer>
                    }
                </div>
            </div>

            <div className="hm-row-wide">
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-calendar-check"></i> Bookings per Restaurant</h2>
                        <Link to="/booking" className="hm-card-link">View all</Link>
                    </div>
                    {bookingsPerResturent.length === 0
                        ? <p className="hm-empty">No booking data yet.</p>
                        : <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={bookingsPerResturent} margin={{ top:10, right:10, left:0, bottom:40 }} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" {...grid}/>
                                <XAxis dataKey="name" tick={{ ...axis, fontSize:10 }}
                                    axisLine={false} tickLine={false} angle={-25} textAnchor="end" interval={0}/>
                                <YAxis tick={axis} axisLine={false} tickLine={false} allowDecimals={false}/>
                                <Tooltip content={<DashTooltip/>}/>
                                <Bar dataKey="count" name="Bookings" fill="#14B8A6" radius={[6,6,0,0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    }
                </div>
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-utensils"></i> Dishes per Restaurant</h2>
                        <Link to="/product" className="hm-card-link">View all</Link>
                    </div>
                    {productsPerResturent.length === 0
                        ? <p className="hm-empty">No product data yet.</p>
                        : <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={productsPerResturent} margin={{ top:10, right:10, left:0, bottom:40 }} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" {...grid}/>
                                <XAxis dataKey="name" tick={{ ...axis, fontSize:10 }}
                                    axisLine={false} tickLine={false} angle={-25} textAnchor="end" interval={0}/>
                                <YAxis tick={axis} axisLine={false} tickLine={false} allowDecimals={false}/>
                                <Tooltip content={<DashTooltip/>}/>
                                <Bar dataKey="count" name="Dishes" fill="#F7C35F" radius={[6,6,0,0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    }
                </div>
            </div>

            <div className="hm-row-single">
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-box-open"></i> Product Availability</h2>
                        <Link to="/product" className="hm-card-link">View all</Link>
                    </div>
                    <ResponsiveContainer width="100%" height={130}>
                        <BarChart data={productAvailability} layout="vertical"
                            margin={{ top:5, right:20, left:10, bottom:5 }} barSize={28}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} {...grid}/>
                            <XAxis type="number" tick={axis} axisLine={false} tickLine={false} allowDecimals={false}/>
                            <YAxis type="category" dataKey="name" tick={axis} axisLine={false} tickLine={false} width={80}/>
                            <Tooltip content={<DashTooltip/>}/>
                            <Bar dataKey="count" name="Products" radius={[0,6,6,0]}>
                                {productAvailability.map((e,i) => <Cell key={i} fill={e.fill}/>)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="hm-row-mid">
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-receipt"></i> Recent Orders</h2>
                        <Link to="/checkout" className="hm-card-link">View all</Link>
                    </div>
                    {recentOrders.length === 0
                        ? <p className="hm-empty">No orders yet.</p>
                        : <div className="hm-table-wrap">
                            <table className="hm-table">
                                <thead><tr>
                                    <th>#</th><th>Customer</th><th>Pay Mode</th>
                                    <th>Subtotal</th><th>Delivery</th><th>Total</th>
                                    <th>Order Status</th><th>Payment</th>
                                </tr></thead>
                                <tbody>
                                    {recentOrders.map((c,i) => {
                                        const s = orderBadge(c.orderStatus);
                                        return (
                                            <tr key={i}>
                                                <td style={{ color:"var(--text-muted)", fontSize:11 }}>#{i+1}</td>
                                                <td style={{ color:"var(--text-primary)", fontWeight:600 }}>{c.user?.name||"—"}</td>
                                                <td>{c.paymentMode||"COD"}</td>
                                                <td>{fmt(c.subtotal||0)}</td>
                                                <td>{fmt(c.deliveryCharge||0)}</td>
                                                <td style={{ color:"var(--text-primary)", fontWeight:700 }}>{fmt(c.total||0)}</td>
                                                <td><span className={s.cls}>{s.label}</span></td>
                                                <td><span className={payBadge(c.paymentStatus)}>{c.paymentStatus||"Pending"}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>

            <div className="hm-row-bottom">
                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-calendar-check"></i> Recent Bookings</h2>
                        <Link to="/booking" className="hm-card-link">View all</Link>
                    </div>
                    {recentBookings.length === 0
                        ? <p className="hm-empty">No bookings yet.</p>
                        : <div className="hm-table-wrap">
                            <table className="hm-table">
                                <thead><tr>
                                    <th>Customer</th><th>Restaurant</th><th>Date</th>
                                    <th>Time</th><th>Seats</th><th>Total</th>
                                    <th>Payment</th><th>Status</th>
                                </tr></thead>
                                <tbody>
                                    {recentBookings.map((b,i) => (
                                        <tr key={i}>
                                            <td style={{ color:"var(--text-primary)", fontWeight:600 }}>{b.user?.name||"—"}</td>
                                            <td>{b.resturent?.name||"—"}</td>
                                            <td>{b.date||"—"}</td>
                                            <td>{b.time||"—"}</td>
                                            <td>{b.seats||"—"}</td>
                                            <td style={{ color:"var(--text-primary)", fontWeight:700 }}>{fmt(b.total||0)}</td>
                                            <td><span className={payBadge(b.paymentStatus)}>{b.paymentStatus||"Pending"}</span></td>
                                            <td>
                                                <span className={`hm-badge ${b.bookingStatus ? "hm-badge--success" : "hm-badge--danger"}`}>
                                                    {b.bookingStatus ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>

                <div className="hm-card">
                    <div className="hm-card-header">
                        <h2 className="hm-card-title"><i className="fas fa-bolt"></i> Quick Actions</h2>
                    </div>
                    <div className="hm-quick-grid">
                        {[
                            { label:"Add Restaurant",  icon:"fa-store",          link:"/resturent/create",    color:"#4F8EF7" },
                            { label:"Add Product",     icon:"fa-utensils",       link:"/product/create",      color:"#38EFC3" },
                            { label:"Add Category",    icon:"fa-layer-group",    link:"/maincategory/create", color:"#A78BFA" },
                            { label:"Add Subcategory", icon:"fa-list",           link:"/subcategory/create",  color:"#38EF91" },
                            { label:"View Orders",     icon:"fa-receipt",        link:"/checkout",            color:"#F97316" },
                            { label:"View Bookings",   icon:"fa-calendar-check", link:"/booking",             color:"#14B8A6" },
                            { label:"View Messages",   icon:"fa-envelope",       link:"/contactus",           color:"#F75F5F" },
                            { label:"Testimonials",    icon:"fa-star",           link:"/testimonial",         color:"#EC4899" },
                        ].map((q,i) => (
                            <Link to={q.link} key={i} className="hm-quick-btn" style={{ "--q-color":q.color }}>
                                <i className={`fas ${q.icon}`} style={{ color:q.color }}></i>
                                <span>{q.label}</span>
                            </Link>
                        ))}
                    </div>
                    <div style={{ borderTop:"1px solid var(--border)", paddingTop:14, display:"flex", flexDirection:"column", gap:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <span style={{ fontSize:13, color:"var(--text-secondary)", display:"flex", alignItems:"center", gap:7 }}>
                                <i className="fas fa-envelope-open" style={{ color:"var(--accent)" }}></i> Newsletter Subscribers
                            </span>
                            <Link to="/newsletter" className="hm-card-link"><strong>{D.newsletters.length}</strong> subs</Link>
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <span style={{ fontSize:13, color:"var(--text-secondary)", display:"flex", alignItems:"center", gap:7 }}>
                                <i className="fas fa-star" style={{ color:"#F7C35F" }}></i> Testimonials
                            </span>
                            <Link to="/testimonial" className="hm-card-link"><strong>{D.testimonials.length}</strong> reviews</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        </>
    );
}