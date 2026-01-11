export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const ghlRes = await fetch(
      'https://services.leadconnectorhq.com/hooks/DvWTrdD23UD09zv6GgZj/webhook-trigger/17b0254a-2348-40fb-931a-c44f7c24e096',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  ...req.body
})

      }
    );

    const text = await ghlRes.text();
    return res.status(200).json({ success: true, ghlResponse: text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
}

