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

  const VERIFY_TOKEN = Deno.env.get('WHATSAPP_WEBHOOK_VERIFY_TOKEN');
  const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
  const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
  const RECIPIENT_NUMBER = Deno.env.get('WHATSAPP_RECIPIENT_NUMBER');

  // GET request - Webhook verification from Meta
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    console.log('Webhook verification request:', { 
      mode, 
      token: token ? 'present' : 'missing', 
      challenge: challenge ? 'present' : 'missing' 
    });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified successfully');
      return new Response(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    } else {
      console.error('Webhook verification failed:', { mode, tokenMatch: token === VERIFY_TOKEN });
      return new Response('Forbidden', { status: 403 });
    }
  }

  // POST request - Can be either:
  // 1. Webhook event FROM Meta (incoming messages/status updates)
  // 2. Booking notification request FROM frontend
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      
      // Check if this is a booking request from frontend
      if (body.customer) {
        console.log('=== Booking Request Received ===');
        console.log('Customer:', body.customer);
        console.log('Product:', body.product);

        // Validate WhatsApp credentials
        if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !RECIPIENT_NUMBER) {
          console.error('Missing WhatsApp credentials');
          return new Response(
            JSON.stringify({ 
              error: 'WhatsApp API credentials not configured',
              success: false 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        // Format booking notification message
        const { customer, product } = body;
        
        const productLines = product && typeof product === 'object' ? (
          `💍 *Product:* ${product.name ?? 'N/A'}\n` +
          `💰 *Price:* ${product.price ?? 'N/A'}\n` +
          `🔗 *Product ID:* ${product.id ?? 'N/A'}`
        ) : (
          `🛍️ *Request Type:* General Video Shopping (no specific product)`
        );

        const message = `*📹 NEW VIDEO SHOPPING BOOKING*\n\n` +
                       `👤 *Customer:* ${customer?.name ?? 'N/A'}\n` +
                       `📧 *Email:* ${customer?.email ?? 'N/A'}\n` +
                       `📞 *Phone:* ${customer?.phone ?? 'N/A'}\n` +
                       `🕒 *Preferred Time:* ${customer?.preferred_time ?? 'N/A'}\n` +
                       `🌐 *Language:* ${customer?.language ?? 'N/A'}\n\n` +
                       productLines;

        console.log('Sending booking notification to:', RECIPIENT_NUMBER);

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
              recipient_type: 'individual',
              to: RECIPIENT_NUMBER,
              type: 'text',
              text: { 
                preview_url: false,
                body: message 
              }
            })
          }
        );

        const whatsappData = await whatsappResponse.json();
        console.log('WhatsApp API Response:', whatsappData);

        if (!whatsappResponse.ok) {
          console.error('WhatsApp API error:', whatsappData);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to send WhatsApp message',
              details: whatsappData,
              success: false 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        console.log('=== Booking notification sent successfully ===');
        return new Response(
          JSON.stringify({ 
            success: true, 
            message_id: whatsappData.messages?.[0]?.id,
            message: 'Video shopping request sent successfully'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      // Otherwise, this is a webhook event FROM Meta
      console.log('Webhook event received from Meta:', JSON.stringify(body, null, 2));

      if (body.object === 'whatsapp_business_account') {
        const entries = body.entry || [];
        
        for (const entry of entries) {
          const changes = entry.changes || [];
          
          for (const change of changes) {
            if (change.field === 'messages') {
              const value = change.value;
              console.log('Message event:', JSON.stringify(value, null, 2));
              
              // Log message details
              if (value.messages) {
                for (const message of value.messages) {
                  console.log('Message received:', {
                    from: message.from,
                    id: message.id,
                    timestamp: message.timestamp,
                    type: message.type
                  });
                }
              }

              // Log status updates
              if (value.statuses) {
                for (const status of value.statuses) {
                  console.log('Message status:', {
                    id: status.id,
                    status: status.status,
                    timestamp: status.timestamp,
                    recipient_id: status.recipient_id
                  });
                }
              }
            }
          }
        }
      }

      // Always return 200 OK to acknowledge receipt from Meta
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(
        JSON.stringify({ 
          error: error.message,
          success: false 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  }

  return new Response('Method not allowed', { status: 405 });
});