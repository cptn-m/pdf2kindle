console.log("content.js loaded")

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action !== "generateAndUpload") return;

  // Get credentials from storage
  const supabaseUrl = "https://jsnhmgzvyqzkmimwlkln.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzbmhtZ3p2eXF6a21pbXdsa2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDI5MzMsImV4cCI6MjA5NzUxODkzM30.lCmeQfqFlblufM2AvWooLLFV5NW3fENu6beTQJBKLIs";
  const bucket = "html2kindle/public";

  // Generate PDF blob from current page
  const pdfBlob = await html2pdf()
    .set({
      margin: 10,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .from(document.body)
    .outputPdf("blob");

console.log("PDF generated, uploading...")  

  // Build filename from page title + timestamp
    // const filename = `${document.title.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.pdf`;
  const filename = `public/${document.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
  console.log(`Uploading ${filename}...`);
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
    alert(`Uploaded: ${filename}`);
  } else {
    const err = await response.json();
    alert(`Upload failed: ${err.message}`);
  }
});