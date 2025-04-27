// Sample Menu Items
const menuItems = [
  { id: 1, name: "Veg Biryani", price: 150 },
  { id: 2, name: "Paneer Butter Masala", price: 200 },
  { id: 3, name: "Chicken 65", price: 250 },
  { id: 4, name: "Tandoori Roti", price: 20 },
  { id: 5, name: "Mango Lassi", price: 80 },
  { id: 6, name: "Dragon Chicken", price: 250 },
  { id: 7, name: "Chilli Chicken", price: 250 },
  { id: 8, name: "Chicken 65", price: 250 },
  { id: 9, name: "Chicken Fry Piece Biryani", price: 300 },
  { id: 10, name: "Thumbsup", price: 30 },
];

const menuDiv = document.getElementById('menu');
const billItemsDiv = document.getElementById('bill-items');
const subtotalSpan = document.getElementById('subtotal-amount');
const taxSpan = document.getElementById('tax-amount');
const discountSpan = document.getElementById('discount-amount');
const totalAmountSpan = document.getElementById('total-amount');

let bill = {};

function renderMenu() {
  menuItems.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = "flex justify-between items-center p-4 bg-gray-700 rounded-md";

    itemDiv.innerHTML = `
      <div>
        <h3 class="font-semibold text-xl">${item.name}</h3>
        <p class="text-gray-400">₹${item.price}</p>
      </div>
      <button onclick="addItem(${item.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
        Add
      </button>
    `;

    menuDiv.appendChild(itemDiv);
  });
}

function addItem(id) {
  const selectedItem = menuItems.find(item => item.id === id);

  if (bill[id]) {
    bill[id].quantity += 1;
  } else {
    bill[id] = { ...selectedItem, quantity: 1 };
  }

  updateBill();
}

function changeQuantity(id, amount) {
  if (bill[id]) {
    bill[id].quantity += amount;
    if (bill[id].quantity <= 0) {
      delete bill[id];
    }
    updateBill();
  }
}

function updateBill() {
  billItemsDiv.innerHTML = '';
  let subtotal = 0;

  Object.values(bill).forEach(item => {
    const itemRow = document.createElement('div');
    itemRow.className = "flex justify-between items-center";

    itemRow.innerHTML = `
      <div class="flex gap-2 items-center">
        <button onclick="changeQuantity(${item.id}, -1)" class="bg-red-500 px-2 rounded">-</button>
        <span class="w-36">${item.name} x ${item.quantity}</span>
        <button onclick="changeQuantity(${item.id}, 1)" class="bg-green-500 px-2 rounded">+</button>
      </div>
      <span>₹${item.price * item.quantity}</span>
    `;

    billItemsDiv.appendChild(itemRow);

    subtotal += item.price * item.quantity;
  });

  const tax = subtotal * 0.05;
  const discount = subtotal * 0.10;
  const total = subtotal + tax - discount;

  subtotalSpan.innerText = `₹${subtotal.toFixed(2)}`;
  taxSpan.innerText = `₹${tax.toFixed(2)}`;
  discountSpan.innerText = `-₹${discount.toFixed(2)}`;
  totalAmountSpan.innerText = `₹${total.toFixed(2)}`;
}

async function generatePDF() {
  const customerName = document.getElementById('customer-name').value.trim() || 'Customer';
  const billElement = document.querySelector('.bill-section'); // updated class name

  const canvas = await html2canvas(billElement, {
    scale: 2,
    useCORS: true
  });
  const imgData = canvas.toDataURL('image/png');

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pdfWidth - 20;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let y = 20;

  pdf.setFontSize(22);
  pdf.text('VIBE & DINE RESTAURANT', pdfWidth / 2, 15, { align: 'center' });

  pdf.setFontSize(14);
  pdf.text(`Customer: ${customerName}`, 10, y + 5);

  pdf.addImage(imgData, 'PNG', 10, y + 15, imgWidth, imgHeight);

  pdf.save(`${customerName.replace(/\s+/g, '_')}_bill.pdf`);
}

renderMenu();
