
const moment = require('moment');
const _ = require('lodash');

export class CommonHelper {
  static mappingRequestDataToModel(model, newData) {
    _.forOwn(newData, function (field, key) {
      if (field) model[key] = field;
    });
  }

  static randomSecretCode() {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 6; i > 0; --i)
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }

  static formatCurrentTime() {
    return moment().format('YYYYMMDDHHmmss')
  }

  static dateRegex() {
    return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  }

  static timeRegex() {
    return /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  }

  static getTimeZone() {
    const offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
    return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
  }

  static convertTimeInt(time: string) {
    const [hours, minutes, seconds] = time.split(':');
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds ?? 0);
  }

  static successResponsePayload(
    message: string,
    payload?: any
  ) {
    return {
      status: true,
      message,
      payload
    };
  }

  static failResponsePayload(
    message: string
  ) {
    return {
      status: false,
      message
    };
  }

  static async pagination(paginationOptions: { page; limit }, query) {
    const limit = _.parseInt(paginationOptions.limit);
    const page = _.parseInt(paginationOptions.page);
    const offset = (page > 1) ? ((page - 1) * limit) : 0;
    const total = await query.getCount();
    const items = await query.skip(offset).take(limit).getMany();

    const checkGetAll = limit === 0 && page === 0;
    const meta = {
      "totalItems": total,
      "itemCount": items.length,
      "itemsPerPage": checkGetAll ? items.length : limit,
      "totalPages": checkGetAll ? 1 : Math.ceil(total / limit),
      "currentPage": checkGetAll ? 1 : page
    };
    return {
      items,
      meta
    };
  }

  static async convertDataForPagination(query) {
    let { page, limit } = query;
    limit = limit ? (limit > 100 ? 100 : limit) : 10;
    page = page ? page : 1;
    const searchQuery = _.omit(query, ['page', 'limit']);

    return {
      pagination: { page, limit },
      searchQuery
    };
  }
}