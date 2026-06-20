browser.runtime.onMessage.addListener(async (message) => {
  if (message.action !== "generatePDF") return;

  const { supabaseUrl, supabaseKey, bucket } = await browser.storage.local.get([
    "supabaseUrl", "supabaseKey", "bucket"
  ]);

  // Generate PDF blob from the current page
  const pdfBlob = await html2pdf()
    .set({
      margin: 10,
      filename: "page.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .from(document.body)
    .outputPdf("blob");

  // Build a filename from the page title + timestamp
  const filename = `${document.title.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.pdf`;

  // Upload to Supabase Storage
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${bucket}/${filename}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/pdf",
      },
      body: pdfBlob,
    }
  );

  if (response.ok) {
    console.log("PDF uploaded:", filename);
  } else {
    const err = await response.json();
    console.error("Upload failed:", err);
  }
});