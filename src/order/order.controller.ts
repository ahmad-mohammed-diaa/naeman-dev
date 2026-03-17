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
import { DateRangeQueryDto } from './dto/date-range-query.dto';
import { BarberOrdersQueryDto } from './dto/barber-orders-query.dto';
import { PaidOrdersQueryDto } from './dto/paid-orders-query.dto';
import { OrderPasswordBodyDto } from './dto/order-password-body.dto';
import { PaidOrderBodyDto } from './dto/paid-order-body.dto';
import { GetSlotsQueryDto } from './dto/get-slots-query.dto';
import { GenerateSlotBodyDto } from './dto/generate-slot-body.dto';

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
    @Query() query: DateRangeQueryDto,
  ) {
    const today = new Date();
    const oneMonthBefore = new Date();
    oneMonthBefore.setMonth(today.getMonth() - 1);
    const fromDate = new Date(query.fromDate ?? oneMonthBefore);
    const toDate = new Date(query.toDate ?? new Date());
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
    @Query() query: BarberOrdersQueryDto,
  ) {
    return this.orderService.GetBarberOrders(user.id, lang, query.orderDate ? new Date(query.orderDate) : undefined);
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
    @Query() query: DateRangeQueryDto,
  ) {
    const DateFrom = new Date(query.fromDate ?? new Date());
    const DateTo = new Date(query.toDate ?? new Date());
    return this.orderService.getCashierOrders(user.id, lang, DateFrom, DateTo);
  }

  @OrderSwagger.getPaidOrders()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN', 'CASHIER'])
  @Get('/paid-orders')
  async getPaidOrders(@Query() query: PaidOrdersQueryDto) {
    const DateFrom = new Date(query.date ?? new Date());
    return this.orderService.billOrders(DateFrom);
  }

  @OrderSwagger.deleteOrderServices()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN'])
  @Put('/delete-order-services/:id')
  async deleteOrderServices(
    @Param('id') id: string,
    @Body() body: OrderPasswordBodyDto,
  ) {
    return this.orderService.deleteOrderServices(id, body.password);
  }

  @OrderSwagger.cancelDeletedServices()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN'])
  @Put('/cancel-deleted-services/:id')
  async cancelDeletedServices(
    @Param('id') id: string,
    @Body() body: OrderPasswordBodyDto,
  ) {
    return this.orderService.cancelDeletedServices(id, body.password);
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
    @Body() body: PaidOrderBodyDto,
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
  async getSlots(@Query() query: GetSlotsQueryDto) {
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
  async generateSlot(@Body() body: GenerateSlotBodyDto) {
    return this.orderService.generateSlot(body.start, body.end);
  }
}
