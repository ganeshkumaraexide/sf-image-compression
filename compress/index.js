// const sharp = require('sharp');
// const convert = require('heic-convert');

// const TARGET = 900000;

// // Allowed Salesforce origins
// const ALLOWED_ORIGINS = (
//   process.env.ALLOWED_ORIGINS ||
//   'https://eil--partial.sandbox.lightning.force.com,https://eil.lightning.force.com'
// )
//   .split(',')
//   .map((s) => s.trim())
//   .filter(Boolean);

// // const getCorsHeaders = (req) => {
// //   const origin =
// //     req.headers.origin ||
// //     req.headers.Origin ||
// //     '';
// const getCorsHeaders = (req) => {

//   const headers = req.headers || {};

//   const origin =
//     headers.origin ||
//     headers.Origin ||
//     '';

//   return {
//     'Access-Control-Allow-Origin':
//       ALLOWED_ORIGINS.includes(origin)
//         ? origin
//         : ALLOWED_ORIGINS[0],

//     'Access-Control-Allow-Headers': 'Content-Type',
//     'Access-Control-Allow-Methods': 'POST, OPTIONS',
//     'Vary': 'Origin'
//   };
// };

// const HEIC_BRANDS = [
//   'heic',
//   'heix',
//   'hevc',
//   'hevx',
//   'heim',
//   'heis',
//   'hevm',
//   'hevs',
//   'mif1',
//   'msf1'
// ];

// const isHeic = (buf) =>
//   buf.length > 12 &&
//   buf.toString('ascii', 4, 8) === 'ftyp' &&
//   HEIC_BRANDS.includes(
//     buf.toString('ascii', 8, 12)
//   );

// const ATTEMPTS = [
//   [1600, 80],
//   [1600, 70],
//   [1600, 60],
//   [1600, 50],
//   [1280, 70],
//   [1024, 70],
//   [800, 70],
//   [800, 50]
// ];

// const ATTEMPTS_NO_QUALITY = [
//   [1600, 0],
//   [1280, 0],
//   [1024, 0],
//   [800, 0],
//   [640, 0]
// ];

// const encode = (img, fmt, q) => {
//   switch (fmt) {
//     case 'png':
//       return img.png({
//         palette: true,
//         quality: q,
//         compressionLevel: 9,
//         effort: 7
//       });

//     case 'webp':
//       return img.webp({
//         quality: q
//       });

//     case 'gif':
//       return img.gif({
//         effort: 7
//       });

//     case 'tiff':
//       return img.tiff({
//         compression: 'jpeg',
//         quality: q
//       });

//     case 'heif':
//       return img.avif({
//         quality: q
//       });

//     default:
//       return img.jpeg({
//         quality: q,
//         mozjpeg: true
//       });
//   }
// };

// module.exports = async function (context, req) {

//   const CORS = getCorsHeaders(req);

//   if (req.method === 'OPTIONS') {

//     context.res = {
//       status: 204,
//       headers: CORS
//     };

//     return;
//   }

//   try {

//     // const { url } = req.body || {};
//     const body = req.body || {};
//     const url = body.url;


//     if (!url) {

//       context.res = {
//         status: 400,
//         headers: CORS,
//         body: 'Missing URL'
//       };

//       return;
//     }

//     const host = new URL(url).hostname;

//     if (!/\.(force|salesforce)\.com$/.test(host)) {

//       context.res = {
//         status: 400,
//         headers: CORS,
//         body: 'URL not allowed'
//       };

//       return;
//     }

//     const response = await fetch(url);

//     if (!response.ok) {

//       context.res = {
//         status: 502,
//         headers: CORS,
//         body: 'Download failed: ' + response.status
//       };

//       return;
//     }

//     let input = Buffer.from(
//       await response.arrayBuffer()
//     );

//     let convertedFromHeic = false;

//     if (isHeic(input)) {

//       input = Buffer.from(
//         await convert({
//           buffer: input,
//           format: 'JPEG',
//           quality: 0.9
//         })
//       );

//       convertedFromHeic = true;
//     }

//     const opts = {
//       limitInputPixels: 300000000,
//       failOn: 'none'
//     };

//     const meta = await sharp(
//       input,
//       opts
//     ).metadata();

//     const fmt = meta.format;

//     if (
//       ![
//         'jpeg',
//         'png',
//         'webp',
//         'gif',
//         'tiff',
//         'heif'
//       ].includes(fmt)
//     ) {

//       context.res = {
//         status: 415,
//         headers: CORS,
//         body: 'Unsupported format: ' + fmt
//       };

//       return;
//     }

//     const animated =
//       fmt === 'gif' ||
//       fmt === 'webp';

//     const attempts =
//       fmt === 'gif'
//         ? ATTEMPTS_NO_QUALITY
//         : ATTEMPTS;

//     for (const [width, quality] of attempts) {

//       const out = await encode(
//         sharp(input, {
//           ...opts,
//           animated
//         })
//           .rotate()
//           .resize({
//             width,
//             withoutEnlargement: true
//           }),
//         fmt,
//         quality
//       ).toBuffer();

//       if (out.length <= TARGET) {

//         context.res = {
//           status: 200,
//           headers: {
//             ...CORS,
//             'Content-Type': 'application/json'
//           },
//           body: {
//             base64: out.toString('base64'),
//             size: out.length,
//             ext: convertedFromHeic
//               ? 'jpg'
//               : null
//           }
//         };

//         return;
//       }
//     }

//     context.res = {
//       status: 422,
//       headers: CORS,
//       body: 'Could not get under target size'
//     };

//   } catch (e) {

//     context.res = {
//       status: 500,
//       headers: CORS,
//       body: String(
//         e.message || e
//       )
//     };
//   }
// };

// module.exports = async function (context, req) {

//     try {

//         const result = [];

//         result.push("step1");

//         const sharp = require('sharp');
//         result.push("sharp");

//         const convert = require('heic-convert');
//         result.push("heic");

//         context.res = {
//             status: 200,
//             body: result
//         };

//     } catch(e) {

//         context.res = {
//             status: 500,
//             body: String(e.message || e)
//         };

//     }

// };

module.exports = async function (context, req) {

    try {

        const result = [];

        result.push("step1");

        const body = req.body || {};
        result.push("step2");

        const url = body.url;
        result.push("step3");

        if (!url) {
            context.res = {
                status: 400,
                body: result
            };
            return;
        }

        result.push("step4");

        const host = new URL(url).hostname;
        result.push("step5");

const response = await fetch(url);

result.push("step6");

if (!response.ok) {
    context.res = {
        status: 200,
        body: {
            step: "response-not-ok",
            status: response.status,
            statusText: response.statusText
        }
    };
    return;
}

result.push("step7");

let input = Buffer.from(
    await response.arrayBuffer()
);

result.push("step8");

context.res = {
    status: 200,
    body: result
};

    } catch(e) {

        context.res = {
            status: 500,
            body: String(e.message || e)
        };

    }

};
