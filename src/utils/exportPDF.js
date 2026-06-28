import html2pdf from "html2pdf.js";

export const generatePDF = () => {
    const element = document.querySelector(".resume-template");
    if (!element) return;

    const extractedLinks = [];

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

                    // Extract exact link positions from unscaled cloned DOM
                    const templateRect = capturedElement.getBoundingClientRect();
                    const pxToMm = 210 / templateRect.width;

                    const links = capturedElement.querySelectorAll("a[href]");
                    links.forEach((a) => {
                        const href = a.getAttribute("href");
                        if (href && href !== "#") {
                            const rect = a.getBoundingClientRect();
                            const x = (rect.left - templateRect.left) * pxToMm;
                            const y = (rect.top - templateRect.top) * pxToMm;
                            const w = rect.width * pxToMm;
                            const h = rect.height * pxToMm;
                            extractedLinks.push({ href, x, y, w, h });
                        }
                    });
                }
            }
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        enableLinks: false
    };

    html2pdf()
        .set(opt)
        .from(element)
        .toPdf()
        .get('pdf')
        .then((pdf) => {
            const totalPages = pdf.internal.getNumberOfPages();
            extractedLinks.forEach((link) => {
                const pageIndex = Math.floor(link.y / 297);
                const yOnPage = link.y % 297;
                if (pageIndex < totalPages) {
                    pdf.setPage(pageIndex + 1);
                    pdf.link(link.x, yOnPage, link.w, link.h, { url: link.href });
                }
            });
        })
        .save();
};
