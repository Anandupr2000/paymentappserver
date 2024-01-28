// import app_icon from "../public/images/app_icon.png";
const fs = require('fs');

module.exports = {
    generateEmailContentForOtp: otp => {
        // Specify the path to your image file
        const imagePath = '../public/images/app_icon.png';
        // const imagePath = "";

        // Read the image file as a Buffer
        const imageBuffer = fs.readFileSync(imagePath);
        console.log(imageBuffer);
        // Convert the Buffer to a Base64-encoded string
        const imageBase64 = imageBuffer.toString('base64');

        return (
            `<!DOCTYPE html>
   <html lang="en">
   
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>HiPay Email Verification</title>
       <style>
           body {
               display: flex;
               color: white;
               background: #000;
               max-height: 100vh;
               place-items: center;
               flex-direction: column;
           }
   
           header,
           main,
           footer {
               width: 100%;
           }
           
           header {
               display: flex;
               justify-content: flex-start;
           }
   
           header img {
               width: 10rem;
               padding: 3rem 0 0 5rem;
           }
   
           main {
               width: 38rem;
               display: flex;
               color: black;
               margin-top: 3rem;
               background: white;
               flex-direction: column;
               padding: 2rem 4rem 2rem 4rem;
               border-radius: 13px;
           }
   
           main h2 {
               align-self: center;
               color: rgb(4, 162, 162);
           }
           
           #otp {
               align-self: center;
               font-size: xx-large;
               /* margin-top: 2rem;
               margin-bottom: -3rem; */
   
           }
   
           #otp span:first-child {
               /* color: ; */
               font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
           }
   
           #otp span:last-child {
               color: rgb(4, 162, 162);
               letter-spacing: 1rem;
           }
           footer{
               display: flex;
               position: absolute;
               bottom: 0;
               line-height: 5rem;
               align-self: center;
               justify-content: center;
               min-height: 3rem;
           }
           footer span{
               display: flex;
               gap:2rem
           }
           footer span i{
               color: aqua;
           }
       </style>
   </head>
   
   <body>
       <header>
           <!-- <h1>Header</h1> -->
           <!-- <img src="./images/app_icon.png" /> -->
           <img src=${require("../public/images/app_icon.png")} />
       </header>
       <main>
           <h2>Your OTP</h2>
           <h3>Hi,</h3>
           <p>Thank you for choosing HiPay. Use the following OTP to complete the procedure to verify email address. OTP is
               valid for <b>5 minute</b>. Do not share this code with others, including HiPay Employees.</p>
           <div id="otp">
               <span>OTP : </span>
               <span>${otp}</span>
           </div>
       </main>
       <footer>
           <span>
               <i class="fa fa-facebook"></i>
               <i class="fa fa-instagram"></i>
               <i class="fa fa-twitter"></i>
           </span>
       </footer>
       <script src="https://use.fontawesome.com/e80a03eeb2.js"></script>
   </body>
   
   </html>`
        )
    }
}