const fs = require('fs');
let txt = fs.readFileSync('server.ts', 'utf8');

const target = `<td style="background:linear-gradient(135deg,#2563eb 0%,#06b6d4 100%);padding:32px 40px;text-align:center;">
              <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:1px;">FIRST AVENUE<br>DENTISTRY</div>
              <div style="font-size:12px;color:#e0f2fe;margin-top:6px;letter-spacing:2px;">ST. THOMAS &bull; ONTARIO</div>
            </td>`;

const replacement = `<td style="background:linear-gradient(135deg,#2563eb 0%,#06b6d4 100%);padding:24px 40px;text-align:center;">
              <div style="background-color:#ffffff;padding:12px 16px;border-radius:12px;display:inline-block;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                <img src="\${SITE_URL}/logo.png" alt="\${CLINIC_NAME}" style="max-height:50px;width:auto;display:block;margin:0;" />
              </div>
            </td>`;

const regexTarget = /<td style="background:linear-gradient\(135deg,#2563eb 0%,#06b6d4 100%\);padding:32px 40px;text-align:center;">\s*<div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:1px;">FIRST AVENUE<br>DENTISTRY<\/div>\s*<div style="font-size:12px;color:#e0f2fe;margin-top:6px;letter-spacing:2px;">ST\. THOMAS &bull; ONTARIO<\/div>\s*<\/td>/;

if (regexTarget.test(txt)) {
    txt = txt.replace(regexTarget, replacement);
    fs.writeFileSync('server.ts', txt, 'utf8');
    console.log("Success");
} else {
    console.log("Target not found");
}
