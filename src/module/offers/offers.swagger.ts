// import { ApiDoc } from '../../common/decorators/api-doc.decorator';
// import { OfferResponseDto } from './dto/responses/offer-response.dto';
// import { MessageResponseDto } from '../auth/dto/responses/auth-response.dto';

// export const OffersSwagger = {
//   findAll: () =>
//     ApiDoc({
//       summary: 'Get all active offers',
//       res: { ok: OfferResponseDto, okIsArray: true },
//     }),
//   findOne: () =>
//     ApiDoc({
//       summary: 'Get offer by ID',
//       params: [{ name: 'id' }],
//       res: { ok: OfferResponseDto, notFound: { message: 'Offer not found' } },
//     }),
//   create: () =>
//     ApiDoc({
//       summary: 'Create offer (PACKAGES or POINTS type)',
//       auth: true,
//       consumes: 'multipart/form-data',
//       bodySchema: {
//         type: 'object',
//         required: ['offerType', 'expiresAt', 'price', 'translations'],
//         properties: {
//           offerType: { type: 'string', enum: ['POINTS', 'PACKAGES'] },
//           expiresAt: { type: 'string', format: 'date-time' },
//           price: { type: 'integer', minimum: 1 },
//           image: { type: 'string', format: 'binary', description: 'Offer image' },
//           // PACKAGES only
//           type: { type: 'string', enum: ['MULTIPLE', 'SINGLE'], description: 'PACKAGES only' },
//           serviceIds: { type: 'string', description: 'PACKAGES only — JSON array: ["id1","id2"]' },
//           // POINTS only
//           pointsAmount: { type: 'integer', minimum: 1, description: 'POINTS only — how many points the buyer receives' },
//           // Both
//           translations: { type: 'string', description: 'JSON array: [{name,description,language}]' },
//         },
//       },
//       res: { ok: OfferResponseDto },
//     }),
//   buy: () =>
//     ApiDoc({
//       summary: 'Buy an offer by ID (package or points)',
//       auth: true,
//       params: [{ name: 'id' }],
//       res: {
//         ok: MessageResponseDto,
//         notFound: { message: 'Offer not found' },
//         badRequest: { message: 'Offer expired' },
//       },
//     }),
//   remove: () =>
//     ApiDoc({
//       summary: 'Delete offer',
//       auth: true,
//       params: [{ name: 'id' }],
//       res: { ok: MessageResponseDto, notFound: { message: 'Offer not found' } },
//     }),
// };
