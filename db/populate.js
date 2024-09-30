const excel = require('exceljs');
const GovernmentOfficial = require('../models/govtOfficialModel');
const bcrypt = require('bcryptjs');

exports.populateGovernmentOfficials = async () => {
  try {
    const workbook = new excel.Workbook();
    await workbook.xlsx.readFile('path/to/government_officials.xlsx');
    const worksheet = workbook.getWorksheet(1);

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const officialId = row.getCell(1).value;
      const email = row.getCell(2).value;
      const password = row.getCell(3).value;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await GovernmentOfficial.findOneAndUpdate(
        { officialId },
        { 
          officialId,
          email,
          password: hashedPassword
        },
        { upsert: true, new: true }
      );
    }

    console.log('Government officials data populated successfully');
  } catch (err) {
    console.error('Error populating government officials data:', err);
  }
}
