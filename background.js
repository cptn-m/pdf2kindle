browser.action.onClicked.addListener(async (tab) => {
  try {
    await browser.tabs.saveAsPDF({
      documentId: tab.id,
      toFileName: tab.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".pdf"
    });
  } catch (error) {
    console.error("Failed to save PDF:", error);
  }
});