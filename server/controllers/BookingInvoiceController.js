const PDFDocument = require("pdfkit")
const path = require("path")
const fs = require("fs")
const Booking = require("../models/Booking")
const BookingInvoice = require("../models/BookingInvoice") // create this model (see note below)

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
    brand:      "#1a0a40",       // deep purple — distinct from product invoice
    brandMid:   "#3d1f8a",
    brandLight: "#ede8f8",
    rose:       "#b5184a",       // accent colour for restaurant theme
    roseBg:     "#fde8ef",
    roseDark:   "#6e0c2b",
    amber:      "#b45309",
    amberBg:    "#fef3c7",
    amberDark:  "#633806",
    teal:       "#0d7a6e",
    tealBg:     "#e6f4f2",
    tealDark:   "#085041",
    ink:        "#1a2634",
    inkMid:     "#4a5e70",
    inkLight:   "#8096a8",
    border:     "#d1dbe5",
    rule:       "#e8eef4",
    white:      "#ffffff",
    offwhite:   "#fdf7fc",
}

const F = { h1: 22, h2: 15, h3: 11, body: 9.5, small: 8.5, tiny: 7.5 }

// ── Helpers ───────────────────────────────────────────────────────────────────
const currency = (n) =>
    `Rs. ${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const fmtDate = (d) =>
    new Date(d || Date.now()).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })

function rect(doc, x, y, w, h, fill, rx = 0) {
    doc.save()
    if (rx > 0) doc.roundedRect(x, y, w, h, rx).fill(fill)
    else doc.rect(x, y, w, h).fill(fill)
    doc.restore()
}

function strokeRect(doc, x, y, w, h, strokeColor, lw = 0.5, rx = 0) {
    doc.save()
    if (rx > 0) doc.roundedRect(x, y, w, h, rx).lineWidth(lw).strokeColor(strokeColor).stroke()
    else doc.rect(x, y, w, h).lineWidth(lw).strokeColor(strokeColor).stroke()
    doc.restore()
}

function hRule(doc, y, x1 = 40, x2 = 555, color = "#e8eef4", lw = 0.5) {
    doc.save().strokeColor(color).lineWidth(lw).moveTo(x1, y).lineTo(x2, y).stroke().restore()
}

function pill(doc, x, y, label, bgColor, textColor) {
    doc.fontSize(F.tiny).font("Helvetica-Bold")
    const pw = doc.widthOfString(label) + 14
    rect(doc, x, y, pw, 13, bgColor, 6)
    doc.fillColor(textColor).text(label, x + 7, y + 2, { lineBreak: false })
}

// ── Booking detail row helper ─────────────────────────────────────────────────
function detailRow(doc, x, y, w, label, value, accent) {
    doc.fontSize(F.small).font("Helvetica-Bold").fillColor(C.inkLight)
       .text(label, x, y, { width: w * 0.45 })
    doc.fontSize(F.small).font("Helvetica-Bold").fillColor(accent || C.ink)
       .text(value, x + w * 0.45, y, { width: w * 0.55, align: "right" })
}

// ── PDF Builder ───────────────────────────────────────────────────────────────
function buildBookingInvoicePDF(booking, invoiceNumber) {
    return new Promise((resolve, reject) => {
        const invoicesDir = path.join(__dirname, "../public/invoices")
        if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true })

        const filePath = path.join(invoicesDir, `${invoiceNumber}.pdf`)
        const stream   = fs.createWriteStream(filePath)

        const customer      = booking.user       || {}
        const restaurant    = booking.resturent  || {}
        const bookingDate   = fmtDate(booking.createdAt)
        const visitDate     = booking.date        || "—"
        const visitTime     = booking.time        || "—"
        const seats         = booking.seats       || 1
        const total         = Number(booking.total || 0)
        const payMode       = booking.paymentMode  || "COD"
        const payStatus     = booking.paymentStatus || "Pending"
        const bookingStatus = booking.bookingStatus || "Confirmed"

        const siteName    = process.env.SITE_NAME    || "MyShop"
        const siteAddress = process.env.SITE_ADDRESS || "123 Main Street, New Delhi, India"
        const siteEmail   = process.env.SITE_EMAIL   || "support@myshop.com"
        const sitePhone   = process.env.SITE_PHONE   || "+91 98765 43210"

        const doc = new PDFDocument({ margin: 0, size: "A4" })
        doc.pipe(stream)

        const W = 595, M = 40

        // ── PAGE BACKGROUND ───────────────────────────────────────────────────
        rect(doc, 0, 0, W, 841, C.offwhite)

        // ── HEADER ────────────────────────────────────────────────────────────
        rect(doc, 0, 0, W, 118, C.brand)

        // Decorative circles
        doc.save().opacity(0.06)
        doc.circle(480, -20, 110).fill(C.white)
        doc.circle(530, 90, 70).fill(C.white)
        doc.restore()

        // Brand name
        doc.fontSize(F.h1).font("Helvetica-Bold").fillColor(C.white).text(siteName, M, 26)
        doc.fontSize(F.tiny).font("Helvetica").fillColor("rgba(255,255,255,0.45)")
           .text(siteAddress, M, 54)
           .text(`${siteEmail}  ·  ${sitePhone}`, M, 66)

        // "RESTAURANT BOOKING" label + invoice number (right)
        doc.fontSize(F.tiny).font("Helvetica-Bold").fillColor("rgba(255,255,255,0.40)")
           .text("RESTAURANT BOOKING", 0, 26, { align: "right", width: W - M, characterSpacing: 2 })
        doc.fontSize(F.h2).font("Helvetica-Bold").fillColor(C.white)
           .text(invoiceNumber, 0, 40, { align: "right", width: W - M })
        doc.fontSize(F.tiny).font("Helvetica").fillColor("rgba(255,255,255,0.45)")
           .text(bookingDate, 0, 64, { align: "right", width: W - M })

        // Rose accent bar (instead of teal — restaurant theme)
        rect(doc, 0, 118, W, 3, C.rose)

        // ── GUEST INFO + BOOKING INFO CARD ────────────────────────────────────
        let y = 140

        // Left: Guest Info
        doc.fontSize(F.tiny).font("Helvetica-Bold").fillColor(C.rose)
           .text("GUEST DETAILS", M, y, { characterSpacing: 1.5 })
        y += 13

        doc.fontSize(F.h3).font("Helvetica-Bold").fillColor(C.ink)
           .text(customer.name || "—", M, y)
        y += 15

        doc.fontSize(F.body).font("Helvetica").fillColor(C.inkMid)
        const addr = [customer.address, customer.city, customer.state].filter(Boolean)
        if (addr.length) {
            doc.text(addr.join(", "), M, y, { width: 215 })
            y += doc.heightOfString(addr.join(", "), { width: 215 }) + 4
        }
        if (customer.phone) { doc.text(`Phone: ${customer.phone}`, M, y); y += 13 }
        if (customer.email) { doc.text(`Email: ${customer.email}`, M, y); y += 13 }

        // Right: Booking Info Card
        const cx = 328, cy = 138, cw = 227
        const infoRows = [
            ["Booking ID",   String(booking._id || invoiceNumber).slice(-12)],
            ["Payment Mode", payMode],
            ["Visit Date",   visitDate],
            ["Visit Time",   visitTime],
            ["Seats",        String(seats)],
        ]
        const cardH = 22 + infoRows.length * 18 + 22 + 10

        rect(doc, cx, cy, cw, cardH, C.white, 5)
        strokeRect(doc, cx, cy, cw, cardH, C.border, 0.5, 5)

        // Card header band — rose themed
        rect(doc, cx, cy, cw, 20, C.brandLight, 5)
        rect(doc, cx, cy + 14, cw, 6, C.brandLight)
        doc.fontSize(F.tiny).font("Helvetica-Bold").fillColor(C.brandMid)
           .text("BOOKING DETAILS", cx + 12, cy + 6, { characterSpacing: 1 })

        let iy = cy + 26
        infoRows.forEach(([label, val]) => {
            doc.fontSize(F.small).font("Helvetica-Bold").fillColor(C.inkLight)
               .text(label, cx + 12, iy, { width: 88 })
            doc.fontSize(F.small).font("Helvetica").fillColor(C.ink)
               .text(val, cx + 106, iy, { width: 109 })
            hRule(doc, iy + 14, cx, cx + cw, C.rule, 0.4)
            iy += 18
        })

        // Payment status pill
        doc.fontSize(F.small).font("Helvetica-Bold").fillColor(C.inkLight)
           .text("Payment Status", cx + 12, iy, { width: 88 })
        const isPaid = /paid|success/i.test(payStatus)
        pill(doc, cx + 106, iy, payStatus,
            isPaid ? C.tealBg  : C.amberBg,
            isPaid ? C.tealDark : C.amberDark)

        // ── RESTAURANT DETAILS BLOCK ──────────────────────────────────────────
        y = Math.max(y + 24, cy + cardH + 24)

        const bw = W - 2 * M

        // Section label
        doc.fontSize(F.tiny).font("Helvetica-Bold").fillColor(C.rose)
           .text("RESTAURANT", M, y, { characterSpacing: 1.5 })
        y += 14

        rect(doc, M, y, bw, 100, C.white, 5)
        strokeRect(doc, M, y, bw, 100, C.border, 0.5, 5)
        rect(doc, M, y, 4, 100, C.rose)   // left accent bar

        const rName    = restaurant.name    || "—"
        const rAddress = restaurant.address || "—"
        const rPhone   = restaurant.phone   || "—"
        const rOpen    = restaurant.openTime  || "—"
        const rClose   = restaurant.closeTime || "—"

        doc.fontSize(F.h3).font("Helvetica-Bold").fillColor(C.ink)
           .text(rName, M + 18, y + 12)
        doc.fontSize(F.body).font("Helvetica").fillColor(C.inkMid)
           .text(`Address: ${rAddress}`, M + 18, y + 30, { width: bw - 36 })
        doc.text(`Contact: ${rPhone}`, M + 18, y + 44)
        doc.text(`Hours: ${rOpen} – ${rClose}`, M + 18, y + 58)

        // Booking status pill inside restaurant block
        const bsIsPending = /pending|cancel/i.test(String(bookingStatus))
        pill(doc, M + 18, y + 74, String(bookingStatus),
            bsIsPending ? C.amberBg  : C.tealBg,
            bsIsPending ? C.amberDark : C.tealDark)

        y += 116

        // ── PRICING SUMMARY TABLE ─────────────────────────────────────────────
        doc.fontSize(F.tiny).font("Helvetica-Bold").fillColor(C.rose)
           .text("PRICING SUMMARY", M, y, { characterSpacing: 1.5 })
        y += 14

        const tableW = bw
        const col = {
            desc:  { x: M,       w: 340 },
            qty:   { x: M + 344, w: 60  },
            price: { x: M + 408, w: 107 },
        }

        // Table header
        const hh = 24
        rect(doc, M, y, tableW, hh, C.brand)
        doc.fontSize(F.tiny).font("Helvetica-Bold").fillColor("rgba(255,255,255,0.8)")
        ;[
            ["DESCRIPTION",       col.desc,  "left"  ],
            ["SEATS",             col.qty,   "center"],
            ["AMOUNT",            col.price, "right" ],
        ].forEach(([label, c, align]) =>
            doc.text(label, c.x, y + 7, { width: c.w, align, characterSpacing: 0.8 })
        )
        y += hh

        // Seat reservation row
        const pricePerSeat = seats > 0 ? total / seats : 0
        rect(doc, M, y, tableW, 24, C.white)
        hRule(doc, y, M, M + tableW, C.rule, 0.4)
        doc.fontSize(F.small).font("Helvetica-Bold").fillColor(C.ink)
           .text(`Seat Reservation — ${rName}`, col.desc.x, y + 6, { width: col.desc.w, ellipsis: true })
        doc.font("Helvetica").fillColor(C.inkMid)
           .text(String(seats), col.qty.x, y + 6, { width: col.qty.w, align: "center" })
        doc.font("Helvetica-Bold").fillColor(C.ink)
           .text(currency(total), col.price.x, y + 6, { width: col.price.w, align: "right" })
        y += 24

        hRule(doc, y, M, M + tableW, C.border, 0.8)
        y += 14

        // ── TOTAL ─────────────────────────────────────────────────────────────
        const totX  = 370
        const totRW = M + tableW - totX

        rect(doc, totX - 10, y - 4, totRW + 10, 24, C.brand, 4)
        doc.fontSize(F.body).font("Helvetica-Bold").fillColor(C.white)
           .text("Total Amount", totX, y + 2, { width: 80 })
           .text(currency(total), totX + 80, y + 2, { width: totRW - 80, align: "right" })
        y += 32

        // ── BOOKING POLICY NOTE ───────────────────────────────────────────────
        rect(doc, M, y, tableW, 52, C.white, 5)
        strokeRect(doc, M, y, tableW, 52, C.border, 0.5, 5)
        rect(doc, M, y, 4, 52, C.rose)

        doc.fontSize(F.body).font("Helvetica-Bold").fillColor(C.ink)
           .text("Thank you for your reservation!", M + 18, y + 12)
        doc.fontSize(F.small).font("Helvetica").fillColor(C.inkMid)
           .text(
               `For changes or cancellations, contact us at ${siteEmail}  ·  Please arrive 10 min before your slot.`,
               M + 18, y + 28, { width: tableW - 36 }
           )

        // ── FOOTER ────────────────────────────────────────────────────────────
        rect(doc, 0, 795, W, 46, C.brand)
        doc.fontSize(F.tiny).font("Helvetica").fillColor("rgba(255,255,255,0.35)")
           .text(
               `© ${new Date().getFullYear()} ${siteName}  ·  All rights reserved  ·  Computer-generated booking confirmation, no signature required.`,
               0, 813, { align: "center", width: W }
           )

        doc.end()
        stream.on("finish", () => resolve(filePath))
        stream.on("error",  reject)
    })
}

// ── Route Handler ─────────────────────────────────────────────────────────────
async function createBookingInvoice(req, res) {
    try {
        const { bookingId } = req.body
        if (!bookingId) return res.status(400).json({ result: "Fail", reason: "bookingId is required." })

        const booking = await Booking.findById(bookingId)
            .populate("user")
            .populate("resturent")

        if (!booking) return res.status(404).json({ result: "Fail", reason: "Booking not found." })

        // Return existing invoice if already generated
        const existing = await BookingInvoice.findOne({ booking: bookingId })
        if (existing) return res.json({ result: "Done", invoice: { invoiceNumber: existing.invoiceNumber } })

        const datePart      = new Date().toISOString().slice(0, 10).replace(/-/g, "")
        const rand          = Math.floor(1000 + Math.random() * 9000)
        const invoiceNumber = `BINV-${datePart}-${rand}`

        await buildBookingInvoicePDF(booking, invoiceNumber)

        await new BookingInvoice({
            user:          booking.user?._id || booking.user,
            booking:       booking._id,
            invoiceNumber,
        }).save()

        res.json({ result: "Done", invoice: { invoiceNumber } })

    } catch (error) {
        console.error("Booking invoice error:", error)
        res.status(500).json({ result: "Fail", reason: "Failed to generate booking invoice." })
    }
}

module.exports = { createBookingInvoice }