export const sortBy = {
  createdAt: "createdAt",
  view: "view",
  sold: "sold",
  price: "price"
} as const
// as const giúp object chỉ đọc, tránh ghi đè ts k bắt lỗi dc
// vd : sortBy.createdAt = "abc" => lỗi

export const order = {
  asc: "asc",
  desc: "desc"
} as const
