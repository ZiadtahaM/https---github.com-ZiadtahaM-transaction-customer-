
  const customerTable = document.getElementById('customer-table').getElementsByTagName('tbody')[0];
  const searchBox = document.getElementById('search-box');
  const ctx = document.getElementById('transaction-chart').getContext('2d');
  
  // Sample customer and transaction data
  const customers = [
    { id: 1, name: 'Ahmed Ali', transactions: [] },
    { id: 2, name: 'Aya Elsayed', transactions: [] },
    { id: 3, name: 'Mina Adel', transactions: [] },
    { id: 4, name: 'Sarah Reda', transactions: [] },
    { id: 5, name: 'Mohamed Sayed', transactions: [] },
  ];
  
  const transactions = [
    { id: 1, customer_id: 1, date: "2023-07-19", amount: 1000 },
    { id: 2, customer_id: 2, date: "2023-07-2", amount: 6000 },
    { id: 3, customer_id: 3, date: "2023-07-8", amount: 4000 },
    { id: 4, customer_id: 4, date: "2023-07-4", amount: 9000 },
    { id: 5, customer_id: 5, date: "2023-07-29", amount: 600 }
  ];
  
  let chart; // To store the Chart.js instance
  
  // Function to render customers based on search term
  function renderCustomers(filteredCustomers) {
    customerTable.innerHTML = ''; // Clear existing table rows
    
    filteredCustomers.forEach(customer => {
      const tableRow = document.createElement('tr');
      const nameCell = document.createElement('td');
      const totalAmountCell = document.createElement('td');
      
      nameCell.textContent = customer.name;
      totalAmountCell.textContent = calculateTotalTransactionAmount(customer.id); // Call function to calculate total amount
      
      tableRow.appendChild(nameCell);
      tableRow.appendChild(totalAmountCell);
      customerTable.appendChild(tableRow);
    });
    
    updateTransactionChart(filteredCustomers); // Update the chart with filtered customers
  }
  
  // Function to calculate total transaction amount for a customer
  function calculateTotalTransactionAmount(customerId) {
    const customerTransactions = transactions.filter(transaction => transaction.customer_id === customerId);
    const totalAmount = customerTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    return totalAmount;
  }
  
  // Function to update or create the transaction chart
  function updateTransactionChart(filteredCustomers) {
    // Clear previous chart if it exists
    if (chart) {
      chart.destroy();
    }
    
    // Extract customer IDs from filtered customers
    const customerIds = filteredCustomers.map(customer => customer.id);
    
    // Filter transactions based on filtered customer IDs
    const filteredTransactions = transactions.filter(transaction => customerIds.includes(transaction.customer_id));
    
    // Group transactions by date
    const transactionData = groupTransactionsByDate(filteredTransactions);
    const labels = Object.keys(transactionData);
    const datasets = [{
      label: 'Total Transaction Amount',
      data: Object.values(transactionData),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }];
    
    // Create new chart instance
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
  
  // Function to group transactions by date
  function groupTransactionsByDate(transactions) {
    const transactionMap = {};
    transactions.forEach(transaction => {
      const date = transaction.date.slice(0, 10); // Extract only the date part (YYYY-MM-DD)
      if (!transactionMap[date]) {
        transactionMap[date] = 0;
      }
      transactionMap[date] += transaction.amount;
    });
    return transactionMap;
  }
  
  // Initial render
  renderCustomers(customers); // Render initial customer list
  
  // Search functionality
  searchBox.addEventListener('keyup', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredCustomers = customers.filter(customer => customer.name.toLowerCase().includes(searchTerm));
    renderCustomers(filteredCustomers);
  });


