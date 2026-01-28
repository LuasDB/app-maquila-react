//------------------------------------------------------
// Customers 
//------------------------------------------------------
const initialCustomers = [
  {
    id: 1,
    name: 'Tienda El Pantalón',
    businessName: 'Comercializadora El Pantalón S.A.',
    rfc: 'CEP123456789',
    phone: '555-1234',
    email: 'contacto@elpantalon.com',
    address: 'Av. Principal #123, Col. Centro',
    city: 'Ciudad de México',
    state: 'CDMX',
    creditLimit: 50000,
    creditDays: 30,
    currentBalance: 15000,
    active: true,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Boutique Fashion',
    businessName: 'Fashion Store S.A. de C.V.',
    rfc: 'FST987654321',
    phone: '555-5678',
    email: 'ventas@fashion.com',
    address: 'Calle Comercio #456',
    city: 'Guadalajara',
    state: 'Jalisco',
    creditLimit: 30000,
    creditDays: 15,
    currentBalance: 8500,
    active: true,
    createdAt: '2024-02-10'
  },
  {
    id: 3,
    name: 'Distribuidora Norte',
    businessName: 'Distribuidora Norte S.A.',
    rfc: 'DNO456789123',
    phone: '555-9012',
    email: 'compras@norte.com',
    address: 'Blvd. Industrial #789',
    city: 'Monterrey',
    state: 'Nuevo León',
    creditLimit: 75000,
    creditDays: 45,
    currentBalance: 42000,
    active: true,
    createdAt: '2024-03-05'
  },
  {
    id: 4,
    name: 'Almacenes del Sur',
    businessName: 'Almacenes del Sur S.A.',
    rfc: 'ADS789123456',
    phone: '555-3456',
    email: 'info@sur.com',
    address: 'Av. Sur #321',
    city: 'Puebla',
    state: 'Puebla',
    creditLimit: 25000,
    creditDays: 30,
    currentBalance: 0,
    active: false,
    createdAt: '2024-01-20'
  }
]

let customersDB = [...initialCustomers]

const customerService = {
    getAll: () => {
        return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...customersDB])
        }, 300)
        })
    },

    getById: (id) => {
        return new Promise((resolve) => {
        setTimeout(() => {
            const customer = customersDB.find(c => c.id === id)
            resolve(customer)
        }, 200)
        })  
    },

    create: (customerData) => {
        return new Promise((resolve) => {
        setTimeout(() => {
            const newCustomer = {
            ...customerData,
            id: Math.max(...customersDB.map(c => c.id), 0) + 1,
            currentBalance: 0,
            createdAt: new Date().toISOString().split('T')[0]
            }
            customersDB = [...customersDB, newCustomer]
            resolve(newCustomer)
        }, 300)
        })  
    },

    update: (id, customerData) => {
        return new Promise((resolve) => {
        setTimeout(() => {
            customersDB = customersDB.map(c => 
            c.id === id ? { ...c, ...customerData } : c
            )
            resolve(customersDB.find(c => c.id === id))
        }, 300)
        })
    },

    delete: (id) => {
        return new Promise((resolve) => {
        setTimeout(() => {
            customersDB = customersDB.filter(c => c.id !== id)
            resolve(true)
        }, 300)
        })
    }
}
//------------------------------------------------------
// Payments 
//------------------------------------------------------
const initialPayments = [
    {
        id: 1,
        saleId: 1,
        customerId: 1,
        folio: 'PAG-2024-001',
        amount: 5000,
        paymentMethod: 'transfer',
        reference: 'TRF123456',
        paymentDate: '2024-11-20',
        notes: 'Pago parcial',
        receivedBy: 1,
        createdAt: '2024-11-20'
    },
    {
        id: 2,
        saleId: 2,
        customerId: 2,
        folio: 'PAG-2024-002',
        amount: 1500,
        paymentMethod: 'cash',
        reference: '',
        paymentDate: '2024-12-05',
        notes: 'Anticipo',
        receivedBy: 1,
        createdAt: '2024-12-05'
    },
    {
        id: 3,
        saleId: 3,
        customerId: 1,
        folio: 'PAG-2024-003',
        amount: 15000,
        paymentMethod: 'transfer',
        reference: 'TRF789012',
        paymentDate: '2024-11-10',
        notes: 'Pago total',
        receivedBy: 1,
        createdAt: '2024-11-10'
    }
]

let paymentsDB = [...initialPayments]

const paymentService = {
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...paymentsDB])  
      }, 500)  
    })  
  },

  getBySaleId: (saleId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(paymentsDB.filter(p => p.saleId === saleId))  
      }, 500)  
    })  
  },

  getByCustomerId: (customerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(paymentsDB.filter(p => p.customerId === customerId))  
      }, 500)  
    })  
  },

  create: (paymentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPayment = {
          ...paymentData,
          id: Math.max(...paymentsDB.map(p => p.id), 0) + 1,
          folio: `PAG-2024-${String(paymentsDB.length + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString().split('T')[0]
        }  

        paymentsDB = [...paymentsDB, newPayment]  

        // Actualizar la venta
        const sale = salesDB.find(s => s.id === paymentData.saleId)  
        if (sale) {
          sale.amountPaid += paymentData.amount  
          sale.balance -= paymentData.amount  

          if (sale.balance <= 0) {
            sale.status = 'paid'  
            sale.balance = 0  
          } else {
            sale.status = 'partial'  
          }

          // Actualizar saldo del cliente
          const customer = customersDB.find(c => c.id === sale.customerId)  
          if (customer) {
            customer.currentBalance -= paymentData.amount  
            if (customer.currentBalance < 0) customer.currentBalance = 0  
          }
        }

        resolve(newPayment)  
      }, 500)  
    })  
  }
}  

//------------------------------------------------------
// Sales 
//------------------------------------------------------

const initialSales = [
    {
        id: 1,
        folio: 'NV-2024-001',
        customerId: 1,
        date: '2024-11-15',
        dueDate: '2024-12-15',
        subtotal: 17241.38,
        tax: 2758.62,
        total: 20000,
        amountPaid: 5000,
        balance: 15000,
        status: 'partial',
        paymentType: 'credit',
        notes: 'Entrega de 100 pantalones modelo slim fit',
        items: [
        { description: 'Pantalón Mezclilla Slim Fit', quantity: 100, unitPrice: 172.41, total: 17241.38 }
        ],
        createdBy: 1,
        createdAt: '2024-11-15'
    },
    {
        id: 2,
        folio: 'NV-2024-002',
        customerId: 2,
        date: '2024-12-01',
        dueDate: '2024-12-16',
        subtotal: 8620.69,
        tax: 1379.31,
        total: 10000,
        amountPaid: 1500,
        balance: 8500,
        status: 'partial',
        paymentType: 'credit',
        notes: 'Pedido urgente',
        items: [
        { description: 'Pantalón Casual Negro', quantity: 50, unitPrice: 172.41, total: 8620.69 }
        ],
        createdBy: 1,
        createdAt: '2024-12-01'
    },
    {
        id: 3,
        folio: 'NV-2024-003',
        customerId: 1,
        date: '2024-10-10',
        dueDate: '2024-11-10',
        subtotal: 12931.03,
        tax: 2068.97,
        total: 15000,
        amountPaid: 15000,
        balance: 0,
        status: 'paid',
        paymentType: 'credit',
        notes: '',
        items: [
        { description: 'Pantalón Formal', quantity: 75, unitPrice: 172.41, total: 12931.03 }
        ],
        createdBy: 1,
        createdAt: '2024-10-10'
    }
]

let salesDB = [...initialSales]

const saleService = {
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...salesDB]);
      }, 500);
    });
  },

  getByCustomerId: (customerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(salesDB.filter(s => s.customerId === customerId));
      }, 500);
    });
  },

  getById: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(salesDB.find(s => s.id === id));
      }, 500);
    });
  },

  create: (saleData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSale = {
          ...saleData,
          id: Math.max(...salesDB.map(s => s.id), 0) + 1,
          folio: `NV-2024-${String(salesDB.length + 1).padStart(3, '0')}`,
          amountPaid: 0,
          balance: saleData.total,
          status: saleData.paymentType === 'cash' ? 'paid' : 'pending',
          createdAt: new Date().toISOString().split('T')[0]
        };

        if (saleData.paymentType === 'cash') {
          newSale.amountPaid = newSale.total;
          newSale.balance = 0;
        }

        salesDB = [...salesDB, newSale];

        // Actualizar saldo del cliente
        const customer = customersDB.find(c => c.id === saleData.customerId);
        if (customer && saleData.paymentType === 'credit') {
          customer.currentBalance += newSale.balance;
        }

        resolve(newSale);
      }, 500);
    });
  },

  update: (id, saleData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        salesDB = salesDB.map(s => s.id === id ? { ...s, ...saleData } : s);
        resolve(salesDB.find(s => s.id === id));
      }, 500);
    });
  },

  delete: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sale = salesDB.find(s => s.id === id);
        if (sale && sale.balance > 0) {
          const customer = customersDB.find(c => c.id === sale.customerId);
          if (customer) {
            customer.currentBalance -= sale.balance;
          }
        }

        salesDB = salesDB.filter(s => s.id !== id);
        resolve(true);
      }, 500);
    });
  }
}

export {
    customerService,
    paymentService,
    saleService
}