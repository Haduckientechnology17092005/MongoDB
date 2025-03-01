import express from 'express';
import { UserController } from './controller';

const setupUserRoute = (controller: UserController) => {
    const router = express.Router();

    router.get('/:id', controller.getOne.bind(controller));
    router.put('/:id', controller.editUser.bind(controller));
    router.delete('/:id', controller.deleteUser.bind(controller));
    router.post('/:id/follow', controller.followUser.bind(controller));
    router.post('/:id/unfollow', controller.unfollowUser.bind(controller));
    router.get('/:id/suggestions', controller.suggestUsers.bind(controller));
    return router;
}

export default setupUserRoute;
