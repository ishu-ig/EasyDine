import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const featureData = {
    'Free Delivery': {
        eyebrow: 'Free Delivery',
        headline: ['Zero delivery fees,', 'maximum savings'],
        subtitle: 'We believe great food shouldn\'t come with hidden charges. Enjoy free delivery on hundreds of partner restaurants every day.',
        heroTitle: 'Free on orders above ₹299',
        heroDesc: 'No delivery charges ever on eligible restaurants. Just order, relax, and enjoy your meal at the best price.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        ),
        stats: [
            { value: '500+', label: 'Free delivery restaurants' },
            { value: '₹0', label: 'Delivery fee on eligible orders' },
            { value: '₹299', label: 'Minimum order value' },
        ],
        included: [
            'All partner restaurants with free delivery badge',
            'Applicable on first 3 orders for new users',
            'No promo code required — auto applied',
            'Valid on all payment methods',
        ],
        notes: [
            'Surge pricing may apply during peak hours',
            'Radius limit: within 8 km of restaurant',
            'Not combinable with cashback coupons',
        ],
        faqs: [
            { q: 'How do I know if a restaurant offers free delivery?', a: 'Look for the green "Free Delivery" badge on the restaurant card. It\'s automatically applied at checkout — no action needed from your side.' },
            { q: 'Can I stack free delivery with discount coupons?', a: 'Free delivery can be combined with food discount coupons, but not with cashback or delivery-specific offers. The better saving is applied automatically.' },
        ],
    },
    'Express & Fast Delivery': {
        eyebrow: 'Express & Fast Delivery',
        headline: ['Hot food, faster', 'than ever before'],
        subtitle: 'Our express network of dedicated riders ensures your order arrives piping hot in record time — guaranteed.',
        heroTitle: 'Delivered in under 30 minutes',
        heroDesc: 'Express delivery uses priority lane routing and dedicated riders stationed near top restaurants for lightning-fast drop-offs.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        ),
        stats: [
            { value: '28 min', label: 'Average express delivery time' },
            { value: '98%', label: 'On-time delivery rate' },
            { value: '200+', label: 'Express-enabled restaurants' },
        ],
        included: [
            'Priority routing to nearest available rider',
            'Real-time GPS tracking from kitchen to door',
            'Dedicated express lane at partner restaurants',
            'Instant push notifications at every step',
        ],
        notes: [
            'Small premium of ₹25–₹49 per express order',
            'Free for EazyDine Pro subscribers',
            'Refund if delivery exceeds 45 minutes',
        ],
        faqs: [
            { q: 'What if my express order is late?', a: 'If your express order exceeds 45 minutes, you\'ll receive a full refund of the express delivery fee as wallet credits, automatically within 24 hours.' },
            { q: 'Is express available at all restaurants?', a: 'Express is available at 200+ partner restaurants marked with the lightning bolt icon. Availability may vary by time of day and your delivery location.' },
        ],
    },
    '24/7 Food Availability': {
        eyebrow: '24/7 Availability',
        headline: ["Hunger doesn't", 'follow a schedule'],
        subtitle: 'Whether it\'s a midnight snack or an early morning breakfast, we\'ve got restaurants open around the clock, every day of the year.',
        heroTitle: 'Order any time, day or night',
        heroDesc: 'Over 80 restaurants on our platform operate 24 hours. Late-night cravings? We\'ve got you covered 365 days a year.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        stats: [
            { value: '80+', label: '24/7 open restaurants' },
            { value: '365', label: 'Days a year, no holidays' },
            { value: '15 min', label: 'Avg late-night delivery time' },
        ],
        included: [
            'Biryani, kebabs & North Indian',
            'Pizza, burgers & fast food',
            'Desserts, ice cream & shakes',
            'Healthy bowls and juices',
        ],
        notes: [
            'Rider safety protocols active after 11 PM',
            'Live support chat available all night',
            'Filter by "Open Now" to see live options',
        ],
        faqs: [
            { q: 'How do I find restaurants open right now?', a: 'Use the "Open Now" filter on the restaurant listing page. It automatically shows only restaurants currently accepting orders based on your real-time location.' },
        ],
    },
    'Eco-Friendly Packaging': {
        eyebrow: 'Eco-Friendly Packaging',
        headline: ['Good food,', 'good for the planet'],
        subtitle: 'Our partner restaurants use 100% biodegradable and sustainable packaging — so every order you place helps reduce plastic waste.',
        heroTitle: '100% plastic-free packaging',
        heroDesc: 'From sugarcane containers to recycled paper bags, every item is packaged responsibly — without compromising freshness.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 22l10-10M16 8c0 4-4 8-10 10 0-6 2-12 10-10z" />
            </svg>
        ),
        stats: [
            { value: '120+', label: 'Eco-certified restaurants' },
            { value: '2 lakh', label: 'Plastic items saved monthly' },
            { value: '0', label: 'Single-use plastic in packaging' },
        ],
        included: [
            'Bagasse (sugarcane fibre) containers',
            'Recycled kraft paper bags',
            'Corn-starch biodegradable cutlery',
            'Water-based ink on all labels',
        ],
        notes: [
            'Annual audit of all partner packaging',
            'Eco score badge on every restaurant',
            'Carbon-neutral delivery by 2026',
        ],
        faqs: [
            { q: 'How do restaurants get eco certified?', a: 'Restaurants submit packaging samples which are independently audited. Only those using 100% biodegradable materials across all packaging items receive the eco badge.' },
        ],
    },
    'Multiple Address Support': {
        eyebrow: 'Multiple Address Support',
        headline: ['Order to home,', 'office, or anywhere'],
        subtitle: 'Save multiple delivery addresses and switch between them in one tap — perfect for ordering to home, the office, or a friend\'s place.',
        heroTitle: 'Up to 5 saved addresses',
        heroDesc: 'Label them as Home, Office, Gym, or any custom name. Your last-used address is remembered for even faster checkout.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
        ),
        stats: [
            { value: '5', label: 'Saved addresses per account' },
            { value: '1 tap', label: 'To switch delivery location' },
            { value: 'Auto', label: 'GPS location detection' },
        ],
        included: [
            'Custom labels (Home, Work, Other)',
            'Delivery instructions per address',
            'Landmark and floor/flat details',
            'GPS pin-drop for precision',
        ],
        notes: [
            'Go to Profile → Saved Addresses to manage',
            'Add, edit, or delete any address anytime',
            'Set a default address for faster checkout',
        ],
        faqs: [
            { q: 'Can I add a new address during checkout?', a: 'Yes. During checkout you can add a new address on the spot and optionally save it to your profile for future orders — all without leaving the checkout flow.' },
        ],
    },
    'Customizable Orders': {
        eyebrow: 'Customizable Orders',
        headline: ['Your food,', 'your exact way'],
        subtitle: 'From spice levels to portion sizes and ingredient swaps, personalise every dish exactly how you like it — right from the menu.',
        heroTitle: 'Personalise every single dish',
        heroDesc: 'Choose your spice level, swap ingredients, skip toppings, or double the cheese — granular control over what arrives at your door.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
        ),
        stats: [
            { value: '10+', label: 'Customisation options per dish' },
            { value: 'Free', label: 'Most ingredient swaps' },
            { value: 'Saved', label: 'Reorder with same preferences' },
        ],
        included: [
            'Spice level (mild, medium, extra hot)',
            'Portion size (half / full / double)',
            'Add / remove toppings or sides',
            'Special instructions as free text',
        ],
        notes: [
            'Veg / vegan / jain filter per item',
            'Allergen notes sent directly to kitchen',
            'Saved preference profile for repeat orders',
        ],
        faqs: [
            { q: 'Are ingredient swaps always free?', a: 'Most standard swaps (removing toppings, changing spice level) are free. Upgrades like extra cheese or premium proteins may carry a small add-on charge shown clearly on the item page.' },
            { q: 'Can I save my customisation for next time?', a: 'Yes — when you reorder a past item, your previous customisations are pre-filled. You can update them or place directly with the same configuration.' },
        ],
    },
};

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
    --primary: #C8400A; --primary-light: #E86834; --secondary: #F4A044;
    --accent: #1A1A2E; --light: #FDF6EE; --dark: #1C1009;
    --gray: #7A6E65; --border: rgba(200,64,10,0.12); --card: #FFFBF7;
    --shadow-sm: 0 2px 12px rgba(28,16,9,0.07);
    --shadow-md: 0 8px 32px rgba(28,16,9,0.12);
    --shadow-lg: 0 20px 60px rgba(28,16,9,0.18);
    --rad: 16px; --tr: all 0.32s cubic-bezier(0.4,0,0.2,1);
}

.fd-page { min-height:100vh; background:linear-gradient(160deg,#FDF6EE 0%,#FFF8F2 60%,#F9EFE4 100%); font-family:'DM Sans',sans-serif; padding:48px 0 96px; }

.fd-back-btn { display:inline-flex; align-items:center; gap:8px; background:white; border:1.5px solid var(--border); border-radius:50px; padding:9px 20px; font-size:0.84rem; font-weight:600; color:var(--dark); cursor:pointer; transition:var(--tr); text-decoration:none; margin-bottom:40px; }
.fd-back-btn svg { width:15px; height:15px; stroke:var(--primary); fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; transition:var(--tr); }
.fd-back-btn:hover { border-color:var(--primary); color:var(--primary); }
.fd-back-btn:hover svg { transform:translateX(-3px); }

.fd-header { margin-bottom:28px; }
.fd-eyebrow { font-size:0.68rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--primary); margin-bottom:8px; display:flex; align-items:center; gap:8px; }
.fd-eyebrow::after { content:''; flex:1; height:1px; background:var(--border); }
.fd-headline { font-family:'Playfair Display',serif; font-size:clamp(1.8rem,4vw,2.6rem); font-weight:900; color:var(--dark); line-height:1.15; margin-bottom:12px; letter-spacing:-0.02em; }
.fd-subtitle { font-size:0.9rem; color:var(--gray); line-height:1.75; max-width:520px; }

.fd-hero { border-radius:var(--rad); background:var(--primary); padding:28px 32px; margin-bottom:22px; display:flex; align-items:center; gap:24px; position:relative; overflow:hidden; }
.fd-hero::before { content:''; position:absolute; right:-40px; top:-40px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
.fd-hero-icon { width:60px; height:60px; border-radius:14px; background:rgba(255,255,255,0.18); display:flex; align-items:center; justify-content:center; flex-shrink:0; position:relative; z-index:1; }
.fd-hero-icon svg { width:26px; height:26px; stroke:#fff; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.fd-hero-text { flex:1; position:relative; z-index:1; }
.fd-hero-text h2 { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:700; color:#fff; margin-bottom:5px; }
.fd-hero-text p { font-size:0.84rem; color:rgba(255,255,255,0.78); line-height:1.6; margin:0; }

.fd-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:22px; }
.fd-stat { background:white; border:1px solid var(--border); border-radius:12px; padding:18px 20px; }
.fd-stat-val { font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:700; color:var(--primary); line-height:1; }
.fd-stat-label { font-size:0.73rem; color:var(--gray); margin-top:5px; font-weight:500; }

.fd-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:22px; }
.fd-card { background:white; border:1px solid var(--border); border-radius:12px; padding:18px 20px; }
.fd-card h4 { font-size:0.8rem; font-weight:700; color:var(--dark); margin-bottom:10px; display:flex; align-items:center; gap:6px; }
.fd-card h4 svg { width:13px; height:13px; stroke:var(--primary); fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.fd-list { display:flex; flex-direction:column; gap:8px; }
.fd-row { display:flex; align-items:flex-start; gap:9px; font-size:0.82rem; color:var(--gray); line-height:1.5; }
.fd-check { width:18px; height:18px; min-width:18px; border-radius:50%; background:rgba(200,64,10,0.1); display:flex; align-items:center; justify-content:center; margin-top:1px; }
.fd-check svg { width:10px; height:10px; stroke:var(--primary); fill:none; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; }

.fd-faq h3 { font-family:'Playfair Display',serif; font-size:1rem; font-weight:700; color:var(--dark); margin-bottom:12px; }
.fd-faq-item { border:1px solid var(--border); border-radius:10px; margin-bottom:8px; overflow:hidden; }
.fd-faq-q { padding:13px 16px; font-size:0.84rem; font-weight:600; color:var(--dark); cursor:pointer; display:flex; justify-content:space-between; align-items:center; background:white; list-style:none; }
.fd-faq-q::-webkit-details-marker { display:none; }
details[open] .fd-faq-q { border-bottom:1px solid var(--border); }
.fd-faq-a { padding:12px 16px; font-size:0.82rem; color:var(--gray); line-height:1.7; background:white; }
.fd-faq-arrow { width:15px; height:15px; stroke:var(--gray); fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; transition:transform 0.25s; flex-shrink:0; }
details[open] .fd-faq-arrow { transform:rotate(180deg); }

@media(max-width:768px){
    .fd-stats { grid-template-columns:1fr 1fr; }
    .fd-grid { grid-template-columns:1fr; }
    .fd-hero { flex-direction:column; text-align:center; }
}
@media(max-width:480px){
    .fd-stats { grid-template-columns:1fr; }
}
`;

function CheckIcon() {
    return (
        <div className="fd-check">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
    );
}

export default function FeatureDetail() {
    const location = useLocation();
    const navigate = useNavigate();

    // Title passed via Link state: <Link to="/feature-detail" state={{ title: item.title }}>
    const title = location.state?.title;
    const data = featureData[title];

    if (!data) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 24px', fontFamily: "'DM Sans',sans-serif" }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#1C1009', marginBottom: 12 }}>Feature not found</h2>
                <p style={{ color: '#7A6E65', marginBottom: 24 }}>No feature matched "{title}". Please go back and try again.</p>
                <button onClick={() => navigate(-1)} style={{ background: '#C8400A', color: 'white', border: 'none', borderRadius: '50px', padding: '10px 24px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <>
            <style>{styles}</style>
            <div className="fd-page">
                <div className="container" style={{ maxWidth: 860 }}>

                    {/* Back button */}
                    <button className="fd-back-btn" onClick={() => navigate(-1)}>
                        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                        Back to Features
                    </button>

                    {/* Header */}
                    <div className="fd-header">
                        <div className="fd-eyebrow">{data.eyebrow}</div>
                        <h1 className="fd-headline">
                            {data.headline[0]}<br />{data.headline[1]}
                        </h1>
                        <p className="fd-subtitle">{data.subtitle}</p>
                    </div>

                    {/* Hero card */}
                    <div className="fd-hero">
                        <div className="fd-hero-icon">{data.icon}</div>
                        <div className="fd-hero-text">
                            <h2>{data.heroTitle}</h2>
                            <p>{data.heroDesc}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="fd-stats">
                        {data.stats.map(s => (
                            <div className="fd-stat" key={s.label}>
                                <div className="fd-stat-val">{s.value}</div>
                                <div className="fd-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Detail cards */}
                    <div className="fd-grid">
                        <div className="fd-card">
                            <h4>
                                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                                What's included
                            </h4>
                            <div className="fd-list">
                                {data.included.map(item => (
                                    <div className="fd-row" key={item}><CheckIcon />{item}</div>
                                ))}
                            </div>
                        </div>
                        <div className="fd-card">
                            <h4>
                                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                Things to note
                            </h4>
                            <div className="fd-list">
                                {data.notes.map(note => (
                                    <div className="fd-row" key={note}><CheckIcon />{note}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    {data.faqs.length > 0 && (
                        <div className="fd-faq">
                            <h3>Frequently asked</h3>
                            {data.faqs.map(faq => (
                                <details className="fd-faq-item" key={faq.q}>
                                    <summary className="fd-faq-q">
                                        {faq.q}
                                        <svg className="fd-faq-arrow" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
                                    </summary>
                                    <div className="fd-faq-a">{faq.a}</div>
                                </details>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}