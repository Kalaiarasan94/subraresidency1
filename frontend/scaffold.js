const fs = require('fs');
const path = require('path');

const dir = 'C:\\xampp\\htdocs\\subraresidency1\\frontend\\src\\components\\admin\\room';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const components = [
    'RoomBasicInformation',
    'RoomPricing',
    'RoomCapacity',
    'RoomSpecifications',
    'RoomAmenities',
    'RoomDescription',
    'RoomImages',
    'RoomStatus'
];

components.forEach(comp => {
    fs.writeFileSync(path.join(dir, `${comp}.tsx`), `import React from 'react';\nimport { UseFormRegister, FieldErrors } from 'react-hook-form';\n\ninterface Props {\n  register: UseFormRegister<any>;\n  errors: FieldErrors;\n}\n\nexport const ${comp}: React.FC<Props> = ({ register, errors }) => {\n  return (\n    <div className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm space-y-4">\n      <h3 className="text-lg font-bold text-catalogue-green">${comp.replace('Room', 'Room ')}</h3>\n      {/* TODO: Add fields */}\n    </div>\n  );\n};\n`);
});

const pageDir = 'C:\\xampp\\htdocs\\subraresidency1\\frontend\\src\\pages\\admin\\room';
if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });

console.log("Scaffold complete.");
