import Router from '@koa/router';
import Boom from '@hapi/boom';
import * as jwt from 'jsonwebtoken';
import classroomRouter from './classroom';
import config from '../config';

const restrictionRouter = new Router({prefix: '/restricted'});

restrictionRouter.use(async (ctx, next) => {
  if (ctx.headers.authorization) {
    const token = ctx.headers.authorization.substring('Bearer '.length);
    if (!token) {
      return ctx.throw(Boom.unauthorized());
    }

    const algorithms = ['HS256'];

    try {
      ctx.user = jwt.verify(token, config.jwtSecret, { algorithms });
    } catch (e) {
      return ctx.throw(Boom.unauthorized());
    }
  }
  else {
    return ctx.throw(Boom.unauthorized());
  }
  return next();
});

restrictionRouter.use(classroomRouter.routes());

export default restrictionRouter;
