import { CommonHelper } from "../../helpers/common";
const path = require('path');
const _ = require('lodash');

export class FileOption {
  static async checkImage(file, inputName) {
    const { originalname, size } = file
    const extension = path.extname(originalname);

    const listExtensionImage = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileMaxSize = 1024 * 1024 * 2;
    if (!listExtensionImage.includes(extension.toLowerCase())) return CommonHelper.failResponsePayload(`${inputName}: Unsupported file type ${extension}`)
    if (size > fileMaxSize) return CommonHelper.failResponsePayload(`${inputName}: File size can't be larger than ${fileMaxSize}`)
    return CommonHelper.successResponsePayload('OK')
  }

  static async checkFile(file, inputName) {
    const { originalname, size } = file
    const extension = path.extname(originalname);

    const listExtensionImage = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
    const fileMaxSize = 1024 * 1024 * 5;
    if (!listExtensionImage.includes(extension.toLowerCase())) return CommonHelper.failResponsePayload(`${inputName}: Unsupported file type ${extension}`)
    if (size > fileMaxSize) return CommonHelper.failResponsePayload(`${inputName}: File size can't be larger than ${fileMaxSize}`)
    return CommonHelper.successResponsePayload('OK')
  }

  static async checkVideo(file, inputName) {
    const { originalname, size } = file
    const extension = path.extname(originalname);

    const listExtensionImage = ['.webm', '.flv', '.mov', '.wmv', '.mp4', '.3gp', '.m4v', '.mpg'];
    const fileMaxSize = 1024 * 1024 * 10;
    if (!listExtensionImage.includes(extension.toLowerCase())) return CommonHelper.failResponsePayload(`${inputName}: Unsupported file type ${extension}`)
    if (size > fileMaxSize) return CommonHelper.failResponsePayload(`${inputName}: File size can't be larger than ${fileMaxSize}`)
    return CommonHelper.successResponsePayload('OK')
  }

  static async checkGeojson(file, inputName) {
    const { originalname, size } = file
    const extension = path.extname(originalname);

    const listExtensionImage = ['.geojson'];
    if (!listExtensionImage.includes(extension.toLowerCase())) return CommonHelper.failResponsePayload(`${inputName}: Unsupported file type ${extension}`)
    return CommonHelper.successResponsePayload('OK', { type: 'geojsons' })
  }

}
