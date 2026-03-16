import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderServicesDto } from './dto/update-order-services.dto';

export const OrderSwagger = {
  getAllOrders: () =>
    ApiDoc({
      summary: 'Get all orders for the current user',
      auth: true,
    }),
  getNewOrders: () =>
    ApiDoc({
      summary: 'Get all orders in a date range (ADMIN, CASHIER)',
      auth: true,
      queries: [
        { name: 'fromDate', required: false, description: 'Start date' },
        { name: 'toDate', required: false, description: 'End date' },
      ],
    }),
  getBarberOrders: () =>
    ApiDoc({
      summary: "Get barber's orders (BARBER only)",
      auth: true,
      queries: [{ name: 'orderDate', required: false, description: 'Filter by order date' }],
    }),
  getCategories: () =>
    ApiDoc({
      summary: 'Get non-selected services/categories for an order',
      auth: true,
      params: [{ name: 'id', description: 'Order ID' }],
    }),
  getCashierOrders: () =>
    ApiDoc({
      summary: 'Get cashier orders in a date range (CASHIER only)',
      auth: true,
      queries: [
        { name: 'fromDate', required: false },
        { name: 'toDate', required: false },
      ],
    }),
  getPaidOrders: () =>
    ApiDoc({
      summary: 'Get paid/billed orders for a date (ADMIN, CASHIER)',
      auth: true,
      queries: [{ name: 'date', required: false }],
    }),
  deleteOrderServices: () =>
    ApiDoc({
      summary: 'Delete order services (ADMIN only)',
      auth: true,
      params: [{ name: 'id', description: 'Order ID' }],
    }),
  cancelDeletedServices: () =>
    ApiDoc({
      summary: 'Cancel deleted services on an order (ADMIN only)',
      auth: true,
      params: [{ name: 'id', description: 'Order ID' }],
    }),
  updateOrderServices: () =>
    ApiDoc({
      summary: 'Update order services (ADMIN, CASHIER)',
      auth: true,
      params: [{ name: 'id', description: 'Order ID' }],
      body: UpdateOrderServicesDto,
    }),
  paidOrder: () =>
    ApiDoc({
      summary: 'Mark an order as paid (ADMIN, CASHIER)',
      auth: true,
      params: [{ name: 'id', description: 'Order ID' }],
    }),
  cancelOrder: () =>
    ApiDoc({
      summary: 'Cancel an order',
      auth: true,
      params: [{ name: 'id', description: 'Order ID' }],
    }),
  startOrder: () =>
    ApiDoc({
      summary: 'Start an order / mark in-progress (ADMIN, BARBER)',
      auth: true,
      params: [{ name: 'id', description: 'Order ID' }],
    }),
  completeOrder: () =>
    ApiDoc({
      summary: 'Mark an order as complete (ADMIN, BARBER)',
      auth: true,
      params: [{ name: 'id', description: 'Order ID' }],
    }),
  getOrderDetails: () =>
    ApiDoc({
      summary: 'Get order details / pricing preview',
      body: CreateOrderDto,
    }),
  getSlots: () =>
    ApiDoc({
      summary: 'Get available time slots',
      queries: [
        { name: 'date', required: true, description: 'Date string (YYYY-MM-DD)' },
        { name: 'barberId', required: false },
        { name: 'totalDuration', required: false, type: Number },
      ],
    }),
  updateOrder: () =>
    ApiDoc({
      summary: 'Update an order (ADMIN, CASHIER, BARBER)',
      auth: true,
      params: [{ name: 'id', description: 'Order ID' }],
      body: UpdateOrderDto,
    }),
  getOrderById: () =>
    ApiDoc({
      summary: 'Get an order by ID',
      auth: true,
      params: [{ name: 'id', description: 'Order ID' }],
    }),
  createOrder: () =>
    ApiDoc({
      summary: 'Create a new order',
      auth: true,
      body: CreateOrderDto,
    }),
  generateSlot: () =>
    ApiDoc({
      summary: 'Generate time slots for a range (ADMIN only)',
      auth: true,
    }),
};
