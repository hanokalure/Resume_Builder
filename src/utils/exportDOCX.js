import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ExternalHyperlink } from "docx";
import { saveAs } from "file-saver";

export const generateDOCX = (state) => {
    const { basicInfo, summary, selectedSkills, education, experience, selectedProjects, selectedCertificates } = state;

    const sections = [];

    // Header Link Helper
    const createContactLink = (url, text, iconPlaceholder) => {
        // Note: docx doesn't support easy inline SVGs without images. 
        // We will just use the text for now as per minimal ATS standards for Word.
        return new ExternalHyperlink({
            children: [
                new TextRun({
                    text: text || url,
                    style: "Hyperlink",
                }),
            ],
            link: url.startsWith("http") || url.startsWith("mailto") || url.startsWith("tel") ? url : `https://${url}`,
        });
    };

    // Build Contact Line
    const contactChildren = [];
    if (basicInfo.email) {
        contactChildren.push(createContactLink(`mailto:${basicInfo.email}`, basicInfo.emailText || basicInfo.email));
    }
    if (basicInfo.phone) {
        if (contactChildren.length > 0) contactChildren.push(new TextRun(" | "));
        contactChildren.push(createContactLink(`tel:${basicInfo.phone}`, basicInfo.phone));
    }

    const socialChildren = [];
    if (basicInfo.linkedin) {
        socialChildren.push(createContactLink(basicInfo.linkedin, basicInfo.linkedinText || "LinkedIn"));
    }
    if (basicInfo.github) {
        if (socialChildren.length > 0) socialChildren.push(new TextRun(" | "));
        socialChildren.push(createContactLink(basicInfo.github, basicInfo.githubText || "GitHub"));
    }


    // Header
    sections.push(
        new Paragraph({
            text: basicInfo.name || "YOUR NAME",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: contactChildren,
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: socialChildren,
        })
    );

    // Summary
    if (summary) {
        sections.push(
            new Paragraph({
                text: "PROFESSIONAL SUMMARY",
                heading: HeadingLevel.HEADING_2,
                thematicBreak: true,
                spacing: { before: 240, after: 120 },
            }),
            new Paragraph({
                children: [new TextRun(summary)],
            })
        );
    }

    // Skills
    if (selectedSkills.length > 0) {
        sections.push(
            new Paragraph({
                text: "SKILLS",
                heading: HeadingLevel.HEADING_2,
                thematicBreak: true,
                spacing: { before: 240, after: 120 },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: selectedSkills.map(s => s.name).join(", "),
                    }),
                ],
            })
        );
    }

    // Education
    if (education.length > 0) {
        sections.push(
            new Paragraph({
                text: "EDUCATION",
                heading: HeadingLevel.HEADING_2,
                thematicBreak: true,
                spacing: { before: 240, after: 120 },
            })
        );
        education.forEach(edu => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: edu.institution, bold: true }),
                        new TextRun({ text: `\t${edu.year}` }),
                    ],
                    tabStops: [{ type: "right", position: 9000 }], // Approx right align
                }),
                new Paragraph({
                    children: [new TextRun(`${edu.degree} | ${edu.gradeType === "Percentage" ? "Percentage" : "CGPA"}: ${edu.gpa}`)],
                    spacing: { after: 120 },
                })
            );
        });
    }

    // Experience
    if (experience.length > 0) {
        sections.push(
            new Paragraph({
                text: "EXPERIENCE",
                heading: HeadingLevel.HEADING_2,
                thematicBreak: true,
                spacing: { before: 240, after: 120 },
            })
        );
        experience.forEach(exp => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.company, bold: true, size: 24 }),
                        new TextRun({ text: `\t${exp.duration}`, italics: true }),
                    ],
                    tabStops: [{ type: "right", position: 9000 }],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.role, italics: true }),
                    ]
                }),
                new Paragraph({
                    children: [new TextRun(exp.description)],
                    spacing: { after: 120 },
                })
            );
        });
    }

    // Projects
    if (selectedProjects.length > 0) {
        sections.push(
            new Paragraph({
                text: "PROJECTS",
                heading: HeadingLevel.HEADING_2,
                thematicBreak: true,
                spacing: { before: 240, after: 120 },
            })
        );
        selectedProjects.forEach(proj => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: proj.title, bold: true }),
                    ]
                }),
                new Paragraph({
                    children: [new TextRun(proj.description)],
                    spacing: { after: 120 },
                })
            );
        });
    }

    // Certificates
    if (selectedCertificates.length > 0) {
        sections.push(
            new Paragraph({
                text: "CERTIFICATIONS",
                heading: HeadingLevel.HEADING_2,
                thematicBreak: true,
                spacing: { before: 240, after: 120 },
            })
        );
        selectedCertificates.forEach(cert => {
            const certText = `${cert.name} - ${cert.issuer} (${cert.year})`;
            sections.push(
                new Paragraph({
                    children: [
                        cert.url ? new ExternalHyperlink({
                            children: [
                                new TextRun({
                                    text: certText,
                                    style: "Hyperlink",
                                }),
                            ],
                            link: cert.url,
                        }) : new TextRun(certText)
                    ]
                })
            )
        });
    }


    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 567, // ~1cm
                            right: 567,
                            bottom: 567,
                            left: 567,
                        },
                    },
                },
                children: sections,
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "resume.docx");
    });
};
