import puppeteer from "puppeteer";

export async function makePDF(htmlContent:string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the HTML content of the page
  await page.setContent(htmlContent);

  // Generate the PDF
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  return [pdfBuffer, async () => await browser.close()];
}

export function objectToCSS(obj:any) {
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
