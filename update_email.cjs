const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf-8');

const oldHeader = `          <tr>
            <td style="background:linear-gradient(135deg,#2563eb 0%,#06b6d4 100%);padding:32px 40px;text-align:center;">
              <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:1px;">FIRST AVENUE<br>DENTISTRY</div>
              <div style="font-size:12px;color:#e0f2fe;margin-top:6px;letter-spacing:2px;">ST. THOMAS &bull; ONTARIO</div>
            </td>
          </tr>`;

const newHeader = `          <tr>
            <td style="background:#ffffff;padding:32px 40px;text-align:center;border-bottom:3px solid #0f172a;">
              <img src="\${SITE_URL}/logo.png" alt="First Avenue Dentistry" style="height:60px;width:auto;display:inline-block;" />
            </td>
          </tr>`;

content = content.replace(oldHeader, newHeader);

fs.writeFileSync('server.ts', content, 'utf-8');
console.log('server.ts updated email template header');
