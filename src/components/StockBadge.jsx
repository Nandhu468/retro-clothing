export default function StockBadge({ stock }) {
  if (stock <= 0) {
    return <span className="text-[11px] tracking-wide text-red-600">SOLD OUT</span>
  }
  if (stock <= 5) {
    return <span className="text-[11px] tracking-wide text-amber-700">ONLY {stock} LEFT</span>
  }
  return <span className="text-[11px] tracking-wide text-green-700">IN STOCK</span>
}
