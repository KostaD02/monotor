import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();
  });

  describe('AppController', () => {
    it('Should get base data', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.base()).not.toBeNull();
    });
  });
});
