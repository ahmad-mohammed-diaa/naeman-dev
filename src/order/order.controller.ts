import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserData } from '../../decorators/user.decorator';
import { Language, User } from 'generated/prisma/client';
import { AuthGuard } from '../../guard/auth.guard';
import { RolesGuard } from 'guard/role.guard';
import { Roles } from 'decorators/roles.decorator';
import { Lang } from 'decorators/accept.language';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderServicesDto } from './dto/update-order-services.dto';
import { OrderSwagger } from './order.swagger';

@ApiTags('Order')
@Controller('v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @OrderSwagger.getAllOrders()
  @UseGuards(AuthGuard(), RolesGuard)
  @Get()
  async getAllOrders(@UserData('user') user: User, @Lang() lang: Language) {
    return this.orderService.getAllOrders(user.id, lang);
  }

  @OrderSwagger.getNewOrders()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN', 'CASHIER'])
  @Get('/getAllOrders')
  async getNewOrders(
    @Lang() lang: Language,
    @UserData('user') user: User,
    @Query('fromDate') from: string,
    @Query('toDate') to: string,
  ) {
    const today = new Date();
    const oneMonthBefore = new Date();
    oneMonthBefore.setMonth(today.getMonth() - 1);
    const fromDate = new Date(from ?? oneMonthBefore);
    const toDate = new Date(to ?? new Date());
    console.log(fromDate, toDate);
    return this.orderService.getAllOrdersDateRange(
      user,
      lang,
      fromDate,
      toDate,
    );
  }

  @OrderSwagger.getBarberOrders()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['BARBER'])
  @Get('/barber-orders')
  async getBarberOrders(
    @UserData('user') user: User,
    @Lang() lang: Language,
    @Query('orderDate') orderDate?: Date,
  ) {
    return this.orderService.GetBarberOrders(user.id, lang, orderDate);
  }

  @OrderSwagger.getCategories()
  @UseGuards(AuthGuard(), RolesGuard)
  @Get('categories/:id')
  async getCategories(@Param('id') id: string, @Lang() lang: Language) {
    return this.orderService.getNonSelectedServices(id, lang);
  }

  @OrderSwagger.getCashierOrders()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['CASHIER'])
  @Get('/cashier')
  async getCashierOrders(
    @UserData('user') user: User,
    @Lang() lang: Language,
    @Query('fromDate') from: string,
    @Query('toDate') to: string,
  ) {
    const DateFrom = new Date(from ?? new Date());
    const DateTo = new Date(to ?? new Date());
    return this.orderService.getCashierOrders(user.id, lang, DateFrom, DateTo);
  }

  @OrderSwagger.getPaidOrders()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN', 'CASHIER'])
  @Get('/paid-orders')
  async getPaidOrders(@Query('date') date: string) {
    const DateFrom = new Date(date ?? new Date());
    return this.orderService.billOrders(DateFrom);
  }

  @OrderSwagger.deleteOrderServices()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN'])
  @Put('/delete-order-services/:id')
  async deleteOrderServices(
    @Param('id') id: string,
    @Body('password') password: string,
  ) {
    return this.orderService.deleteOrderServices(id, password);
  }

  @OrderSwagger.cancelDeletedServices()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN'])
  @Put('/cancel-deleted-services/:id')
  async cancelDeletedServices(
    @Param('id') id: string,
    @Body('password') password: string,
  ) {
    return this.orderService.cancelDeletedServices(id, password);
  }

  @OrderSwagger.updateOrderServices()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN', 'CASHIER'])
  @Put('/update-order-services/:id')
  async updateOrderServices(
    @Param('id') id: string,
    @Body() updateOrderServicesDto: UpdateOrderServicesDto,
  ) {
    return this.orderService.updateOrderServices(id, updateOrderServicesDto);
  }

  @OrderSwagger.paidOrder()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN', 'CASHIER'])
  @Put('/paid-order/:id')
  async paidOrder(
    @Param('id') id: string,
    @UserData('user') user: User,
    @Body() body?: { discount?: number },
  ) {
    return this.orderService.paidOrder(id, user, body);
  }

  @OrderSwagger.cancelOrder()
  @UseGuards(AuthGuard(), RolesGuard)
  @Put('/cancel-order/:id')
  async cancelOrder(@Param('id') id: string, @UserData('user') user: User) {
    return this.orderService.cancelOrder(id, user.role);
  }

  @OrderSwagger.startOrder()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN', 'BARBER'])
  @Put('/start-order/:id')
  async startOrder(@Param('id') id: string) {
    return this.orderService.startOrder(id);
  }

  @OrderSwagger.completeOrder()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN', 'BARBER'])
  @Put('/complete-order/:id')
  async completeOrder(@Param('id') id: string) {
    return this.orderService.completeOrder(id);
  }

  @OrderSwagger.getOrderDetails()
  @UseGuards(AuthGuard(false), RolesGuard)
  @Post('/OrderDetails')
  async getOrderDetails(
    @Body() orderDto: CreateOrderDto,
    @UserData('user') user: User,
    @Lang() lang: Language,
  ) {
    return this.orderService.GetData(orderDto, user.id, lang);
  }

  @OrderSwagger.getSlots()
  @UseGuards(AuthGuard(false), RolesGuard)
  @Get('/slots')
  async getSlots(
    @Query() query: { date: string; barberId?: string; totalDuration?: number },
  ) {
    return this.orderService.getSlots(
      query.date,
      query.barberId,
      query.totalDuration,
    );
  }

  @OrderSwagger.updateOrder()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN', 'CASHIER', 'BARBER'])
  @Put('/:id')
  async updateOrder(
    @Body() updateOrderDto: UpdateOrderDto,
    @Param('id') id: string,
    @UserData('user') user: User,
  ) {
    return this.orderService.updateOrder(id, updateOrderDto, user.role);
  }

  @OrderSwagger.getOrderById()
  @UseGuards(AuthGuard(), RolesGuard)
  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @OrderSwagger.createOrder()
  @UseGuards(AuthGuard(), RolesGuard)
  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @UserData('user') user: User,
    @Lang() lang: Language,
  ) {
    return this.orderService.createOrder(createOrderDto, user.id, lang);
  }

  @OrderSwagger.generateSlot()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN'])
  @Post('/generate-slot')
  async generateSlot(@Body() body: { start: number; end: number }) {
    const { start, end } = body;
    return this.orderService.generateSlot(start, end);
  }
}
