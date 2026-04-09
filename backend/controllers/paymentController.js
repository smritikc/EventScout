import Event from '../models/Events.js';
import User from '../models/Users.js';
import crypto from 'crypto';

// eSewa Sandbox Details
const ESEWA_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
const SECRET_KEY = "8gBm/:&EnhH.1/q"; // Default eSewa Sandbox Secret
const PRODUCT_CODE = "EPAYTEST";     // Default eSewa Sandbox Code

export const createCheckoutSession = async (req, res) => {
  try {
    const { eventId, guests, teamName } = req.body;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.paymentStatus !== 'paid') return res.status(400).json({ message: 'This event is free' });

    const totalTickets = 1 + (Number(guests) || 0);
    const amount = event.price * totalTickets;
    
    // eSewa params
    const transaction_uuid = `evt_${eventId}_${Date.now()}`;
    const tax_amount = 0;
    const total_amount = amount + tax_amount;
    const product_delivery_charge = 0;
    const product_service_charge = 0;

    // Create signature: Message = total_amount,transaction_uuid,product_code
    const message = `${total_amount},${transaction_uuid},${PRODUCT_CODE}`;
    const signature = crypto.createHmac('sha256', SECRET_KEY).update(message).digest('base64');

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // We send back the exact fields required for the eSewa hidden form
    res.json({
      useFormData: true,
      action: ESEWA_URL,
      formData: {
        amount: amount,
        tax_amount: tax_amount,
        total_amount: total_amount,
        transaction_uuid: transaction_uuid,
        product_code: PRODUCT_CODE,
        product_service_charge: product_service_charge,
        product_delivery_charge: product_delivery_charge,
        success_url: `${frontendUrl}/dashboard?payment=success&eventId=${eventId}`,
        failure_url: `${frontendUrl}/dashboard?payment=cancelled`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature,
        // Passing custom state in custom fields is sometimes dropped in eSewa,
        // so we save the state in the URL if needed, or cache it in backend.
      }
    });

  } catch (error) {
    console.error('eSewa Error:', error);
    res.status(500).json({ message: error.message });
  }
};
