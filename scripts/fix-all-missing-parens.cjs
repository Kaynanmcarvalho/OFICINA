const fs = require('fs');
const path = require('path');

const fixes = [
  // GlobalSearch.jsx - linha 343
  {
    file: 'src/components/Navbar/GlobalSearch.jsx',
    search: `      return client.vehicles.some(v => 
        v.plate === vehicle.plate || 
        v.id === vehicle.id ||
        v.vehicleId === vehicle.vehicleId

    });`,
    replace: `      return client.vehicles.some(v => 
        v.plate === vehicle.plate || 
        v.id === vehicle.id ||
        v.vehicleId === vehicle.vehicleId
      );
    });`
  },
  // GlobalSearch.jsx - checkin find
  {
    file: 'src/components/Navbar/GlobalSearch.jsx',
    search: `      const checkin = checkins.find(c => 
        c.vehiclePlate === vehicle.plate ||
        c.vehicleId === vehicle.id`,
    replace: `      const checkin = checkins.find(c => 
        c.vehiclePlate === vehicle.plate ||
        c.vehicleId === vehicle.id
      );`
  }
];

let totalFixed = 0;

fixes.forEach(fix => {
  const filePath = path.join(process.cwd(), fix.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Arquivo não encontrado: ${fix.file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes(fix.search)) {
    content = content.replace(fix.search, fix.replace);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigido: ${fix.file}`);
    totalFixed++;
  } else {
    console.log(`⏭️  Já corrigido ou não encontrado: ${fix.file}`);
  }
});

console.log(`\n🎯 Total de arquivos corrigidos: ${totalFixed}`);
