import { put } from '@vercel/blob';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { businessIdeas, email } = req.body;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  page.drawText(businessIdeas || '', {
    x: 40,
    y: height - 50,
    size: 12,
    font,
    maxWidth: width - 80,
    lineHeight: 14
  });

  const pdfBytes = await pdfDoc.save();

  const blob = await put(
    `business-ideas-${Date.now()}.pdf`,
    Buffer.from(pdfBytes),
    { access: 'public' }
  );

  res.status(200).json({ pdfUrl: blob.url });
}
