document.addEventListener("mouseup", async function() {
    const selectedText = window.getSelection().toString().trim();

    if (selectedText.length > 0) {
        const translation = await translateText(selectedText);

        // Create the popup element
        const popup = document.createElement("div");
        popup.innerText = translation;
        popup.style.position = "absolute";
        popup.style.backgroundColor = "#f0f0f0";
        popup.style.border = "1px solid #ccc";
        popup.style.padding = "5px";
        popup.style.borderRadius = "4px";
        popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
        popup.style.zIndex = 1000;

        // Position the popup next to the selected text
        const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        popup.style.left = `${rect.right + window.scrollX}px`;
        popup.style.top = `${rect.bottom + window.scrollY}px`;

        // Append the popup to the body
        document.body.appendChild(popup);

        // Add event listener to close the popup when clicking outside
        function handleOutsideClick(event) {
            if (!popup.contains(event.target)) {
                document.body.removeChild(popup);
                document.removeEventListener('click', handleOutsideClick);
            }
        }

        document.addEventListener('click', handleOutsideClick, { once: true });
    }
});

async function translateText(text) {
    const targetLanguage = 'en'; // Change this to any language code you prefer
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[0][0][0];
    } catch (error) {
        console.error("Translation error:", error);
        return "Error translating text";
    }
}