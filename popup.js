const status = document.getElementById("status");

// Trigger PDF conversion in active tab
document.getElementById("convertBtn").addEventListener("click", async () => {
  status.textContent = "Working...";
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  browser.tabs.sendMessage(tab.id, { action: "generateAndUpload" });
  window.close();
});