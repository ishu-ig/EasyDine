const { randomUUID } = require("crypto")
const PDFDocument    = require("pdfkit")
const Checkout       = require("../models/Checkout")
const Invoice        = require("../models/Invoice")

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
    // Deep navy + emerald premium palette
    brand:      "#082032",
    brandDark:  "#040F1A",
    brandMid:   "#103B5E",
    brandLight: "#E6EFF7",
    emerald:    "#0A6648",
    emeraldBg:  "#E3F5EE",
    emeraldDark:"#054530",
    amber:      "#B45309",
    amberBg:    "#FEF3C7",
    amberDark:  "#633806",
    sky:        "#0369A1",
    skyBg:      "#E0F2FE",
    skyDark:    "#024E7A",
    silver:     "#C8D8E8",
    silverDark: "#6B8399",
    ink:        "#0D1F2D",
    inkMid:     "#3D5468",
    inkLight:   "#7A96AA",
    border:     "#C8D8E6",
    rule:       "#E4EEF6",
    rowAlt:     "#F3F8FC",
    white:      "#FFFFFF",
    offwhite:   "#F5F9FC",
    highlight:  "#FFF8E7",
}

const F = { h1: 24, h2: 16, h3: 12, body: 9.5, small: 8.5, tiny: 7.5 }

// ── Helpers ───────────────────────────────────────────────────────────────────
const currency = (n) =>
    `₹ ${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const fmtDate = (d) =>
    new Date(d || Date.now()).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })

function rect(doc, x, y, w, h, fill, rx = 0) {
    doc.save()
    if (rx > 0) doc.roundedRect(x, y, w, h, rx).fill(fill)
    else doc.rect(x, y, w, h).fill(fill)
    doc.restore()
}

function strokeRect(doc, x, y, w, h, color, lw = 0.5, rx = 0) {
    doc.save()
    if (rx > 0) doc.roundedRect(x, y, w, h, rx).lineWidth(lw).strokeColor(color).stroke()
    else doc.rect(x, y, w, h).lineWidth(lw).strokeColor(color).stroke()
    doc.restore()
}

function hRule(doc, y, x1 = 40, x2 = 555, color = "#E4EEF6", lw = 0.4) {
    doc.save().strokeColor(color).lineWidth(lw).moveTo(x1, y).lineTo(x2, y).stroke().restore()
}

function dashedRule(doc, y, x1, x2, color, lw = 0.4) {
    doc.save().strokeColor(color).lineWidth(lw).dash(3, { space: 3 }).moveTo(x1, y).lineTo(x2, y).stroke().undash().restore()
}

function pill(doc, x, y, label, bgColor, textColor) {
    doc.fontSize(F.tiny).font("Helvetica-Bold")
    const pw = doc.widthOfString(label) + 16
    rect(doc, x, y, pw, 14, bgColor, 7)
    doc.fillColor(textColor).text(label, x + 8, y + 2.5, { lineBreak: false })
}

function silverLine(doc, y, x1, x2) {
    doc.save()
    doc.strokeColor(C.silver).lineWidth(0.8).moveTo(x1, y).lineTo(x2, y).stroke()
    doc.strokeColor(C.silver).lineWidth(0.3).opacity(0.5).moveTo(x1, y + 2).lineTo(x2, y + 2).stroke()
    doc.restore()
}

// ── PDF Builder ───────────────────────────────────────────────────────────────
function buildProductInvoicePDF(order, invoiceNumber, res) {
    return new Promise((resolve, reject) => {
        const customer    = order.user        || {}
        const products    = Array.isArray(order.products) ? order.products : []
        const subtotal    = Number(order.subtotal      || 0)
        const shipping    = Number(order.deliveryCharge || order.shipping || 0)
        const total       = Number(order.total         || subtotal + shipping)
        const orderDate   = fmtDate(order.createdAt)
        const payMode     = order.paymentMode   || "COD"
        const payStatus   = order.paymentStatus || "Pending"
        const orderStatus = order.orderStatus   || "Order Is Placed"
        const deliveryBoy = order.deliveryBoy   || null

        const siteName    = process.env.SITE_NAME    || "EasyDine"
        const siteAddress = process.env.SITE_ADDRESS || "123 Main Street, New Delhi, India"
        const siteEmail   = process.env.SITE_EMAIL   || "support@easydine.com"
        const sitePhone   = process.env.SITE_PHONE   || "+91 98765 43210"

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename="${invoiceNumber}.pdf"`)

        const doc = new PDFDocument({ margin: 0, size: "A4" })
        doc.pipe(res)

        const W = 595, H = 841, M = 44

        // ── BACKGROUND ────────────────────────────────────────────────────────
        rect(doc, 0, 0, W, H, C.offwhite)

        // Left sidebar strip
        rect(doc, 0, 0, 6, H, C.brand)

        // ── HEADER ────────────────────────────────────────────────────────────
        rect(doc, 0, 0, W, 126, C.brand)

        // Decorative elements
        doc.save().opacity(0.06)
        doc.circle(W - 50, -20, 120).fill(C.emerald)
        doc.restore()
        doc.save().opacity(0.04)
        doc.circle(W + 10, 110, 90).fill(C.white)
        doc.restore()

        // Silver accent bar
        rect(doc, 0, 126, W, 4, C.silver)

        // Brand
        doc.fontSize(F.h1).font("Helvetica-Bold").fillColor(C.white)
           .text(siteName, M + 8, 22)
        doc.fontSize(F.tiny).font("Helvetica").fillColor("rgba(255,255,255,0.40)")
           .text("FOOD DELIVERY · ONLINE ORDERS", M + 8, 50, { characterSpacing: 1.8 })
        doc.fontSize(F.tiny).font("Helvetica").fillColor("rgba(255,255,255,0.36)")
           .text(siteAddress, M + 8, 64)
           .text(`${siteEmail}  ·  ${sitePhone}`, M + 8, 76)

        // Invoice label right
        doc.fontSize(F.tiny).font("Helvetica-Bold").fillColor(C.silver)
           .text("TAX INVOICE", 0, 24, { align: "right", width: W - M - 8, characterSpacing: 2 })
        doc.fontSize(F.h2).font("Helvetica-Bold").fillColor(C.white)
           .text(invoiceNumber, 0, 42, { align: "right", width: W - M - 8 })
        doc.fontSize(F.tiny).font("Helvetica").fillColor("rgba(255,255,255,0.42)")
           .text(orderDate, 0, 64, { align: "right", width: W - M - 8 })

        // ── BILL TO + ORDER INFO ──────────────────────────────────────────────
        let y = 148

        // Bill To label
        doc.fontSize(F.tiny).font("Helvetica-Bold").fillColor(C.emerald)
           .text("BILL TO", M + 8, y, { characterSpacing: 1.8 })
        silverLine(doc, y + 11, M + 8, 265)
        y += 20

        doc.fontSize(F.h3).font("Helvetica-Bold").fillColor(C.ink)
           .text(customer.name || "—", M + 8, y)
        y += 16

        doc.fontSize(F.body).font("Helvetica").fillColor(C.inkMid)
        const addr = [customer.address, customer.city, customer.state, customer.pin].filter(Boolean)
        if (addr.length) {
            doc.text(addr.join(", "), M + 8, y, { width: 210 })
            y += doc.heightOfString(addr.join(", "), { width: 210 }) + 5
        }
        if (customer.phone) {
            doc.fontSize(F.small).text(`✆  ${customer.phone}`, M + 8, y); y += 13
        }
        if (customer.email) {
            doc.fontSize(F.small).text(`✉  ${customer.email}`, M + 8, y); y += 13
        }

        // Order Info Card (right)
        const cx = 314, cy = 144, cw = 238
        const infoRows = [
            ["Order ID",      String(order._id || invoiceNumber).slice(-12)],
            ["Order Date",    orderDate],
            ["Payment Mode",  payMode],
            ["Order Status",  orderStatus],
        ]
        if (deliveryBoy) infoRows.push(["Delivery By", deliveryBoy.name || String(deliveryBoy)])
        const cardH = 28 + infoRows.length * 20 + 30

        // Card shadow
        rect(doc, cx + 3, cy + 3, cw, cardH, "#BDD0E0", 8)
        rect(doc, cx, cy, cw, cardH, C.white, 8)
        strokeRect(doc, cx, cy, cw, cardH, C.border, 0.6, 8)

        // Card header
        rect(doc, cx, cy, cw, 26, C.brand, 8)
        rect(doc, cx, cy + 18, cw, 8, C.brand)
        rect(doc, cx + cw - 4, cy, 4, 10, C.emerald)
        doc.fontSize(F.tiny).font("Helvetica-Bold").fillColor(C.silver)
           .text("ORDER DETAILS", cx + 12, cy + 8, { characterSpacing: 1.2 })

        let iy = cy + 32
        infoRows.forEach(([label, val], idx) => {
            if (idx % 2 === 0) rect(doc, cx, iy - 3, cw, 20, C.rowAlt)
            doc.fontSize(F.small).font("Helvetica").fillColor(C.inkLight)
               .text(label, cx + 12, iy, { width: 88 })
            doc.fontSize(F.small).font("Helvetica-Bold").fillColor(C.ink)
               .text(val, cx + 104, iy, { width: cw - 116, align: "right" })
            iy += 20
        })

        // Payment status pill
        const isPaid = /paid|success/i.test(payStatus)
        rect(doc, cx, iy - 3, cw, 28, C.brandLight)
        strokeRect(doc, cx, iy - 3, cw, 28, C.border, 0.4)
        doc.fontSize(F.small).font("Helvetica").fillColor(C.inkLight)
           .text("Payment Status", cx + 12, iy + 5, { width: 88 })
        pill(doc, cx + 104, iy + 4, payStatus,
            isPaid ? C.emeraldBg : C.amberBg,
            isPaid ? C.emeraldDark : C.amberDark)

        // ── ITEMS TABLE ───────────────────────────────────────────────────────
        y = Math.max(y + 16, cy + cardH + 20)

        doc.fontSize(F.tiny).font("Helvetica-Bold").fillColor(C.emerald)
           .text("ORDER ITEMS", M + 8, y, { characterSpacing: 1.8 })
        silverLine(doc, y + 11, M + 8, W - M - 8)
        y += 20

        const tableW = W - 2 * M - 8
        const col = {
            no:    { x: M,           w: 22  },
            name:  { x: M + 26,      w: 282 },
            qty:   { x: M + 312,     w: 52  },
            price: { x: M + 368,     w: 72  },
            total: { x: M + 444,     w: 63  },
        }

        // Table header
        rect(doc, M, y, tableW, 26, C.brand, 4)
        doc.fontSize(F.tiny).font("Helvetica-Bold").fillColor(C.silver)
        ;[
            ["#",        col.no,    "center"],
            ["ITEM",     col.name,  "left"  ],
            ["QTY",      col.qty,   "center"],
            ["PRICE",    col.price, "right" ],
            ["TOTAL",    col.total, "right" ],
        ].forEach(([label, c, align]) =>
            doc.text(label, c.x + 2, y + 8, { width: c.w, align, characterSpacing: 0.8 })
        )
        y += 26

        // Table rows
        products.forEach((p, i) => {
            const rh        = 24
            const name      = p.name || p.product?.name || "—"
            const qty       = p.qty  || p.quantity || 1
            const price     = Number(p.price || p.product?.finalPrice || 0)
            const lineTotal = Number(p.total || price * qty)
            const isAlt     = i % 2 !== 0

            rect(doc, M, y, tableW, rh, isAlt ? C.rowAlt : C.white)
            if (!isAlt) strokeRect(doc, M, y, tableW, rh, C.rule, 0.3)

            doc.fontSize(F.small).font("Helvetica").fillColor(C.inkLight)
               .text(String(i + 1), col.no.x + 2, y + 7, { width: col.no.w, align: "center" })
            doc.font("Helvetica-Bold").fillColor(C.ink)
               .text(name, col.name.x + 2, y + 7, { width: col.name.w, ellipsis: true })
            doc.font("Helvetica").fillColor(C.inkMid)
               .text(String(qty),         col.qty.x,        y + 7, { width: col.qty.w,   align: "center" })
               .text(currency(price),     col.price.x,      y + 7, { width: col.price.w, align: "right"  })
            doc.font("Helvetica-Bold").fillColor(C.brand)
               .text(currency(lineTotal), col.total.x,      y + 7, { width: col.total.w, align: "right"  })
            y += rh
        })

        // Bottom border of table
        rect(doc, M, y, tableW, 2, C.brand)
        y += 18

        // ── TOTALS ────────────────────────────────────────────────────────────
        const totX  = 365, totRW = M + tableW - totX

        function totRow(label, val, highlight = false) {
            if (highlight) rect(doc, totX - 8, y - 4, totRW + 8, 20, C.highlight, 3)
            doc.fontSize(F.body)
               .font(highlight ? "Helvetica-Bold" : "Helvetica")
               .fillColor(highlight ? C.ink : C.inkLight)
               .text(label, totX, y, { width: 88 })
            doc.font(highlight ? "Helvetica-Bold" : "Helvetica")
               .fillColor(highlight ? C.brand : C.inkMid)
               .text(val, totX + 88, y, { width: totRW - 96, align: "right" })
            y += 18
        }

        totRow("Subtotal",         currency(subtotal))
        totRow("Delivery Charges", currency(shipping))
        dashedRule(doc, y, totX, M + tableW, C.border)
        y += 10

        // Grand total
        rect(doc, totX - 8, y - 4, totRW + 8, 34, C.brand, 6)
        rect(doc, totX - 8, y - 4, 5, 34, C.emerald)   // emerald left cap

        doc.fontSize(F.small).font("Helvetica-Bold").fillColor("rgba(255,255,255,0.55)")
           .text("GRAND TOTAL", totX + 4, y + 2, { width: 88 })
        doc.fontSize(F.h3).font("Helvetica-Bold").fillColor(C.white)
           .text(currency(total), totX + 92, y + 1, { width: totRW - 100, align: "right" })
        y += 44

        // ── THANK YOU NOTE ────────────────────────────────────────────────────
        const noteW = tableW
        rect(doc, M + 4, y + 4, noteW, 56, "#BDD0E0", 8) // shadow
        rect(doc, M, y, noteW, 56, C.white, 8)
        strokeRect(doc, M, y, noteW, 56, C.border, 0.5, 8)
        rect(doc, M, y, 5, 56, C.emerald, 3)

        doc.fontSize(F.body).font("Helvetica-Bold").fillColor(C.ink)
           .text("Thank you for your order!", M + 18, y + 12)
        doc.fontSize(F.small).font("Helvetica").fillColor(C.inkMid)
           .text(
               `For queries contact ${siteEmail}  ·  Returns accepted within 7 days of delivery.`,
               M + 18, y + 28, { width: noteW - 28 }
           )

        // ── FOOTER ────────────────────────────────────────────────────────────
        rect(doc, 0, H - 44, W, 44, C.brand)
        rect(doc, 0, H - 44, W, 3, C.silver)

        doc.fontSize(F.tiny).font("Helvetica").fillColor("rgba(255,255,255,0.30)")
           .text(
               `© ${new Date().getFullYear()} ${siteName}  ·  All rights reserved  ·  This is a computer-generated invoice. No signature required.`,
               0, H - 26, { align: "center", width: W }
           )

        doc.end()
        doc.on("end", resolve)
        doc.on("error", reject)
    })
}

// ── Route Handler ─────────────────────────────────────────────────────────────
async function createProductInvoice(req, res) {
    try {
        const { orderId } = req.body
        if (!orderId) return res.status(400).json({ result: "Fail", reason: "orderId is required." })

        const order = await Checkout.findById(orderId)
            .populate("user")
            .populate("products.product")
            .populate("deliveryBoy")

        if (!order) return res.status(404).json({ result: "Fail", reason: "Order not found." })

        let invoiceNumber
        const existing = await Invoice.findOne({ order: orderId })
        if (existing) {
            invoiceNumber = existing.invoiceNumber
        } else {
            const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "")
            invoiceNumber  = `PINV-${datePart}-${randomUUID().slice(0, 8).toUpperCase()}`
            await new Invoice({
                user:  order.user?._id || order.user,
                order: order._id,
                invoiceNumber,
            }).save()
        }

        await buildProductInvoicePDF(order, invoiceNumber, res)

    } catch (error) {
        console.error("Product invoice error:", error)
        if (!res.headersSent) {
            res.status(500).json({ result: "Fail", reason: "Failed to generate product invoice." })
        }
    }
}

module.exports = { createProductInvoice }