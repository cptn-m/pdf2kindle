const status = document.getElementById("status");

// Save credentials to extension storage
document.getElementById("save").addEventListener("click", () => {
  browser.storage.local.set({
    supabaseUrl: document.getElementById("supabaseUrl").value,
    supabaseKey: document.getElementById("supabaseKey").value,
    bucket: document.getElementById("bucket").value,
  });
  status.textContent = "Credentials saved.";
});

// Load saved credentials into fields on open
browser.storage.local.get(["supabaseUrl", "supabaseKey", "bucket"]).then((data) => {
  if (data.supabaseUrl) document.getElementById("supabaseUrl").value = data.supabaseUrl;
  if (data.supabaseKey) document.getElementById("supabaseKey").value = data.supabaseKey;
  if (data.bucket) document.getElementById("bucket").value = data.bucket;
});

// Trigger PDF generation in the active tab
document.getElementById("convert").addEventListener("click", async () => {
  status.textContent = "Generating PDF...";
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  browser.tabs.sendMessage(tab.id, { action: "generatePDF" });
  window.close();
});