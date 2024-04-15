import { headers } from "next/headers"
import { NextResponse, NextRequest } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const endpointSecret = process.env.WEBHOOK_SECRET as string

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    // console.log("req header", request.headers)
    // if (request.method !== 'POST')
    //   return NextResponse.json({message: "Only POST requests allowed."}, {status: 405})
    //   // return response.status(405).send("Only POST requests allowed.")
    

    const sig: any = headers().get('stripe-signature')
    const resBody = await request.text()

    let event

    try {
      event = stripe.webhooks.constructEvent(resBody, sig, endpointSecret)
    } catch (err: any) {
      console.error(err)
      return NextResponse.json({message: `Webhook error: ${err.message}`}, {status: 400})
      // return response.status(400).send(`Webhook error: ${err.message}`)
    }

    // console.log("event type", JSON.stringify(event.type))

    if (event.type === 'checkout.session.completed') {
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        (event.data.object as any).id,
        {
          expand: ['line_items']
        }
      )
      const lineItems = sessionWithLineItems.line_items

      if (!lineItems) 
        return NextResponse.json({message: "Internal Server Error!"}, {status: 500})
        // return response.status(500).send("Internal Server Error!")

      // business logic
      try {
        console.log("ORDER DONE!!!")
        // console.log("data", lineItems.data)
      } catch (error) {
        console.log("Handling when you're unable to save an order.")
      }
    }

    // response.status(200).end()
    return NextResponse.json("", {status: 200})

  } catch (error) {
    console.error(error)
    return NextResponse.json({message : "Internal Server Error"}, {status: 500})
    // response.status(500).json("Internal server error")
  }

  }