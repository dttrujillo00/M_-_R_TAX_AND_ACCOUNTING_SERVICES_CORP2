const createExcelFile = (table_elt) => {

    // Extract Data (create a workbook object from the table)
    var workbook = XLSX.utils.table_to_book(table_elt);

    // Process Data (add a new row)
    var ws = workbook.Sheets["Sheet1"];
    // XLSX.utils.sheet_add_aoa(ws, [["Exported from M&R app "+new Date().toISOString()]], {origin:-1});

    // Package and Release Data (`writeFile` tries to write and save an XLSB file)
    XLSX.writeFile(workbook, "Reporte.xlsb");
    // alert('Export finished');
}

export {
    createExcelFile
}