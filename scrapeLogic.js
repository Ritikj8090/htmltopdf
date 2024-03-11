const puppeteer = require("puppeteer");
require("dotenv").config();

const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        font-family: 'Times New Roman', Times, serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .certificate {
        background-color: #fff;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        position: relative;
        max-width: 800px;
        height: 1080px;
      }

      .header {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 25px;
        gap: 10px;
      }

      .logo {
        width: 110px;
        height: auto;
        position: absolute;
        top: 20px;
        left: 20px;
      }
      .company {
        color: #3498db;
        text-align: center;
      }

      p { 
        font-size: 18px;
        margin: 10px;
      }
      .body {
        line-height: 1.6;
        padding: 0px 110px;
      }
      .name{
        white-space: 400px;
      }
      .sign {
       align-items: center;
        justify-content: space-between;
        margin-top: 50px;
        display: flex;
      }
      .title{
        text-align: center;
      }
      
      .sign-name{
        text-align: center;
        display: flex;
        flex-direction: column;
      }
    </style>
  </head>

  <body >
    <div id="myContainer" class="certificate">
      <img
        class="logo"
        src="https://www.hikashmavens.in/images/logo.png"
        alt="Company Logo"
      />
      <div class="header">
        <h1 class="company">Hi Kash Mavens</h1>
      </div>
      <h2 class="title">Internship Offer Letter</h2>

      <section>
        <p class="name">
          <strong>Dear <span>__NAME__</span>,</strong>
          <span>__SEND_DATE__</span>
        </p>

        <p>
          On behalf of <strong>Hi-Kash Mavens</strong>, I am excited to extend
          an offer to you for an <strong>internship program</strong> within our
          __DEPARTMENT__. The position is for a __POSITION__.
        </p>
        <p>
          The internship is scheduled to commence on
          <strong>__START_DATE__</strong> and will be a __DURATION__ programme
          from the date of joining. In recognition of your dedication and
          commitment, you will receive an
          <strong>Internship Completion Certificate</strong>. You may also
          receive LOR and incentives for any outstanding performance on your
          side.
        </p>
        <p>
          As an intern at <strong>Hi Kash Mavens</strong>, you will play a
          crucial role in __POSITION_DETAIL__. You will collaborate with experienced
          professionals and contribute your skills to ongoing projects. Your
          role is designed to provide hands-on experience and exposure to the
          dynamic work environment at <strong>Hi Kash Mavens</strong>. You will
          report directly to <strong>__MENTOR__</strong>, who will serve as your
          mentor and guide throughout the internship period.
          <strong>__MENTOR1__</strong> has extensive experience in
          <strong>__MENTOR_EXPERIENCE__</strong>, and we are confident that you
          will benefit greatly from his expertise. Your standard working hours
          will be __HOURS__ hours per week, scheduled between Monday to Friday.
          While we maintain a structured work schedule, we understand the
          importance of flexibility to accommodate your academic commitments.
        </p>
        <p>
          By accepting this offer, you acknowledge that you understand
          participation in this program is not an offer of employment, and
          successful completion of the program does not entitle you to an
          employment offer from <strong>Hi-Kash Mavens</strong>. This offer
          letter represents the full extent of the internship offer and
          supersedes any prior conversations about the position. Changes to this
          agreement may only be made in writing. If you have any questions about
          this offer, please contact our recruiting department.
        </p>
        <p>
          Please review this letter in full and to accept this internship offer,
          kindly sign, and revert a copy of this letter on mail by
          __ACCEPTANCE_DEADLINE__.
        </p>
        <p>
          Congratulations once again, and we look forward to embarking on this
          exciting journey together!
        </p>
      
      <div class="sign">
        <span class="sign-name">
          <strong>Sincerely</strong>
          <img src="__SIGNATURE__" style="display: block; margin-top: 20px;  margin-bottom: 10px; margin-left: 21px; width: 150px; height: 90px;" alt="">
          <strong>Sneha Tiwari</strong>
          <strong>CEO</strong>
        </span>
        <span class="contact">
          Email: - hi-kash@hikashmavens.in <br>
          Mobile: - +918840180023
        </span>
      </div>
    </section>
    </div>
  </body>
</html>
`
const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    // Set screen size
    await page.setContent(htmlContent, { waitUntil: "networkidle2" });

    // Get the dimensions and position of the container
    const containerBoundingBox = await page.$eval(
      "#myContainer",
      (element) => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      }
    );

    // Set the clip option to capture only the specified container
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: landscape,
      width: containerBoundingBox.width,
      height: containerBoundingBox.height,
      clip: {
        x: containerBoundingBox.x,
        y: containerBoundingBox.y,
        width: containerBoundingBox.width,
        height: containerBoundingBox.height,
      },
    });

    res.send(pdfBuffer);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
