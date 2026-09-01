const { jsPDF } = require("./apps/admin/node_modules/jspdf");
const autoTable = require("./apps/admin/node_modules/jspdf-autotable");

console.log("Testing jsPDF in apps/admin...");
const doc = new jsPDF();
console.log("jsPDF instance created:", !!doc);
console.log("autoTable function:", typeof autoTable);
