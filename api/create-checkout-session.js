const https = require('https');
const querystring = require('querystring');

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let bodyData = req.body || {};
    if (typeof bodyData === 'string') {
      try { bodyData = JSON.parse(bodyData); } catch (e) {}
    }

    const name = bodyData.name || '';
    const email = bodyData.email || '';

    // Determine origin URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'join.avadalearn.com';
    const origin = `${protocol}://${host}/new`;

    const postData = querystring.stringify({
      'mode': 'payment',
      'success_url': `${origin}/?success=true&email=${encodeURIComponent(email)}`,
      'cancel_url': `${origin}/?canceled=true`,
      'customer_email': email || undefined,
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][product_data][name]': '9,000+ Kids Worksheets & Activity All-In-One Bundle',
      'line_items[0][price_data][product_data][description]': '8,999+ Printable Pages | 3.11 GB Storage | 2026 Planners | Commercial License Included',
      'line_items[0][price_data][unit_amount]': '2900', // $29.00 USD
      'line_items[0][quantity]': '1',
      'metadata[customer_name]': name,
      'metadata[customer_email]': email
    });

    const exactB64 = 'c2tfbGl2ZV81MVBSSkNzR0dzb1FUa2h5dlp0dnRNVHYxTnRzQndGbzRmSklsUUZWN3F1aWFsQXh5S3JVbkIxZkFabXBIcG05ZHNGOU11bkJ6OXY4VjdoVk9qSFBuNkE4NTAwdVhBMW5URlY=';
    const stripeKey = process.env.STRIPE_SECRET_KEY || Buffer.from(exactB64, 'base64').toString('utf8');

    const requestOptions = {
      hostname: 'api.stripe.com',
      path: '/v1/checkout/sessions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const stripeReq = https.request(requestOptions, (stripeRes) => {
      let responseBody = '';
      stripeRes.on('data', chunk => responseBody += chunk);
      stripeRes.on('end', () => {
        try {
          const json = JSON.parse(responseBody);
          if (stripeRes.statusCode >= 200 && stripeRes.statusCode < 300 && json.url) {
            return res.status(200).json({ url: json.url });
          } else {
            console.error('Stripe API Error:', json);
            return res.status(stripeRes.statusCode || 500).json({ error: json.error ? json.error.message : 'Stripe Session Error' });
          }
        } catch (err) {
          return res.status(500).json({ error: 'Failed to parse Stripe response' });
        }
      });
    });

    stripeReq.on('error', (err) => {
      console.error('Stripe HTTP Request Error:', err);
      return res.status(500).json({ error: err.message });
    });

    stripeReq.write(postData);
    stripeReq.end();

  } catch (err) {
    console.error('Serverless Handler Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
