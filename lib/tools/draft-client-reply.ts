import { findClient } from './find-client'
import { getOrderStatus } from './get-order-status'
import { calculateDeliveryEstimate } from './calculate-delivery-estimate'

export async function draftClientReply(clientName: string) {
  // Step 1 — resolve client
  const clientResult = await findClient(clientName)

  if ('error' in clientResult) {
    return { error: clientResult.error }
  }

  if ('ambiguous' in clientResult) {
    return {
      error: 'Multiple clients found. Please clarify.',
      matches: clientResult.matches
    }
  }

  const client = clientResult.client

  // Step 2 — get their order
  const orderResult = await getOrderStatus(client.id)

  if ('error' in orderResult) {
    return { error: orderResult.error }
  }

  const order = orderResult.orders[0]

  // Step 3 — get delivery estimate for that order
  const estimate = await calculateDeliveryEstimate(order.id)

  if ('error' in estimate) {
    return { error: estimate.error }
  }

  // Step 4 — draft the message based on estimate status
  let message = ''

  if (estimate.status === 'blocked') {
    message = `Hello ${client.name}, thank you for your patience. We are currently reviewing your order and will confirm your delivery date shortly. We appreciate your understanding and will be in touch very soon.`
  } else if (estimate.status === 'at_risk') {
    message = `Hello ${client.name}, we wanted to give you an update on your order. Production is underway and we are targeting delivery around ${estimate.estimated_delivery}. Our team is working hard to meet this date and we will keep you posted on any changes. Thank you for your patience.`
  } else {
    message = `Hello ${client.name}, great news! Your order is on track and we are expecting to have it ready for you by ${estimate.estimated_delivery}. We will reach out as soon as it is ready for pickup or delivery. Thank you for choosing us!`
  }

  // Step 5 — return staged for approval, never auto-send
  return {
    staged: true,
    approval_required: true,
    client: {
      name: client.name,
      phone: client.phone
    },
    order_status: order.status,
    delivery_estimate: estimate.estimated_delivery,
    estimate_status: estimate.status,
    reasoning: estimate.reasoning,
    draft_message: message
  }
}