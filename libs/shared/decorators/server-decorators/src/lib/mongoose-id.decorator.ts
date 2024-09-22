import { HttpException } from '@nestjs/common';
import { registerDecorator } from 'class-validator';
import { GlobalExceptionKeys } from '@fitmonitor/interfaces';
import mongoose from 'mongoose';

export function MongooseId() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'mongooseId',
      target: object.constructor,
      propertyName: propertyName,
      //constraints: [property],
      //options: validationOptions,
      validator: {
        validate(value: string) {
          if (mongoose.isValidObjectId(value)) {
            return true;
          } else {
            const httpExceptionObject: {
              status: number;
              error: string;
              message: string[];
            } = {
              status: 400,
              error: 'Invalid mongoose object ID',
              message: [GlobalExceptionKeys.IncorrectMongooseID],
            };
            throw new HttpException(httpExceptionObject, 400);
          }
        },
      },
    });
  };
}
