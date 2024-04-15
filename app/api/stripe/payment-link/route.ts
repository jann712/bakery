import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

type Product = {
    id: number
    price: string
    quantity: number
}

export async function POST(request:NextRequest, response: NextResponse) {
    const resBody:Omit<Product, "price">[] = await request.json() 

    const newBody:Omit<Product, "id">[] = []

    for (const product of resBody) {
        if (product.id == 1) {
            if (product.quantity > 0) {
                newBody.push({price: process.env.ICECREAM_PRICE as string, quantity: product.quantity })
            }
            
        }
        if (product.id == 2) {
            if (product.quantity > 0) {
                newBody.push({price: process.env.CAKE_PRICE as string, quantity: product.quantity })
            }
        }
    }

    if (newBody.length == 0) return NextResponse.json({error: "No products found in request."}, {status: 500})

    
    const paymentLink = await stripe.paymentLinks.create({
        line_items: newBody
    })

    return NextResponse.json(paymentLink.url, {status: 200})
}