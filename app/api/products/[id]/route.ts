import { NextRequest, NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

const PRODUCTS_FILE = join(process.cwd(), "data", "products.json")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = readFileSync(PRODUCTS_FILE, "utf8")
    const products = JSON.parse(data)
    const product = products.find((p: any) => p.id === params.id)
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Error loading product" }, { status: 500 })
  }
}
