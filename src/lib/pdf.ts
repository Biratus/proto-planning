import puppeteer from "puppeteer";

export async function makePDF(
  htmlContent: string
): Promise<[Buffer, () => Promise<void>]> {
  console.log("makepdf");
  const browser = await puppeteer.launch({ headless: "new" });
  console.log("browser ok");
  const page = await browser.newPage();
  console.log("page ok");

  // Set the HTML content of the page
  await page.setContent(htmlContent);
  console.log("setcontent ok");

  // Generate the PDF
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  return [pdfBuffer, async () => await browser.close()];
}

export function objectToCSS(obj: any) {
  let cssString = "";
  for (let key in obj) {
    cssString += key + " { ";
    for (let prop in obj[key]) {
      cssString += prop + ": " + obj[key][prop] + "; ";
    }
    cssString += "} ";
  }
  return cssString;
}
