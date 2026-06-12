import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customer, product } = await req.json();

    console.log('Received video shopping request:', { customer, product });

    // WhatsApp Cloud API credentials from Supabase Secrets
    const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
    const RECIPIENT_NUMBER = Deno.env.get('WHATSAPP_RECIPIENT_NUMBER');

    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !RECIPIENT_NUMBER) {
      console.error('Missing WhatsApp credentials');
      throw new Error('WhatsApp API credentials not configured');
    }

    // Format message (safe for null product)
    const productLines = product && typeof product === 'object' ? (
      `💍 *Product:* ${product.name ?? 'N/A'}\n` +
      `💰 *Price:* ${product.price ?? 'N/A'}\n` +
      `🔗 *Product ID:* ${product.id ?? 'N/A'}`
    ) : (
      `🛍️ *Request Type:* General Video Shopping (no specific product)`
    );

    const message = `*Booking Request Received*\n\n` +
                   `👤 *Customer:* ${customer?.name ?? 'N/A'}\n` +
                   `📧 *Email:* ${customer?.email ?? 'N/A'}\n` +
                   `📞 *Phone:* ${customer?.phone ?? 'N/A'}\n` +
                   `🕒 *Preferred Time:* ${customer?.preferred_time ?? 'N/A'}\n` +
                   `🌐 *Language:* ${customer?.language ?? 'N/A'}\n\n` +
                   productLines;

    console.log('Sending WhatsApp message to:', RECIPIENT_NUMBER);

    // Send WhatsApp message via Cloud API
    const whatsappResponse = await fetch(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: RECIPIENT_NUMBER,
          type: 'text',
          text: { body: message }
        })
      }
    );

    const whatsappData = await whatsappResponse.json();

    if (!whatsappResponse.ok) {
      console.error('WhatsApp API error:', whatsappData);
      throw new Error(`WhatsApp API error: ${JSON.stringify(whatsappData)}`);
    }

    console.log('WhatsApp message sent successfully:', whatsappData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message_id: whatsappData.messages?.[0]?.id,
        message: 'Video shopping request sent successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in send-video-shopping-details:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
