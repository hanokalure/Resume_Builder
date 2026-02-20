import html2pdf from "html2pdf.js";

export const generatePDF = () => {
    const element = document.querySelector(".resume-template");
    const opt = {
        margin: 0,
        filename: "my-resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            windowWidth: 1200, // Force desktop layout for capture
            onclone: (documentClone) => {
                const capturedElement = documentClone.querySelector(".resume-template");
                if (capturedElement) {
                    // Reset all mobile-specific scaling/positioning
                    capturedElement.style.transform = "none";
                    capturedElement.style.transformOrigin = "top left";
                    capturedElement.style.margin = "0 auto";
                    capturedElement.style.position = "static";

                    // Ensure parent doesn't restrict height/width during capture
                    const parent = capturedElement.parentElement;
                    if (parent) {
                        parent.style.height = "auto";
                        parent.style.width = "auto";
                        parent.style.overflow = "visible";
                    }
                }
            }
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        enableLinks: true,
    };

    html2pdf().set(opt).from(element).save();
};
