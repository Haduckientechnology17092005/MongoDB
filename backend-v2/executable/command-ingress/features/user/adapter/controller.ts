import { BaseController } from '../../../shared/base-controller';
import { HttpRequest } from '../../../types';
import { UserService } from '../types';
import { Response, NextFunction } from 'express';

export class UserController extends BaseController {
  service: UserService;

  constructor(service: UserService) {
    super();
    this.service = service;
  }

  async getOne(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const user = await this.service.getOne(id);
      res.status(200).json(user);
      return;
    });
  }

  async editUser(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const user = await this.service.editUser(id, req.body);
      res.status(200).json(user);
      return;
    });
  }
  
  async deleteUser(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const user = await this.service.deleteUser(id);
      res.status(200).json(user);
      return;
    });
  }

  async followUser(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const followerId = req.body.followerId;
      const user = await this.service.followUser(id, followerId);
      res.status(200).json(user);
      return;
    });
  }

  async unfollowUser(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const followerId = req.body.followerId;
      const user = await this.service.unfollowUser(id, followerId);
      res.status(200).json(user);
      return;
    });
  }

  async suggestUsers(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const users = await this.service.suggestUsers(id);
      res.status(200).json(users);
      return;
    });
  }
}