import type { Controller, ServerApi } from '~/types/types.js';

class ApiBase implements ServerApi {
  public version: string;
  public controllers: InstanceType<new () => Controller>[];

  public constructor(version: string, ...controllers: Controller[]) {
    this.version = version;
    this.controllers = controllers;
  }
}

export { ApiBase };
