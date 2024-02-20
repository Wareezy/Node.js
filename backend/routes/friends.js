import express from 'express';
//now we have to fix the paths

import controller from '../controller/friends.js'
//router() is a method that will run the routes
const router = express.Router()

router
    .route('/')
        .get(controller.getMany)
        .post(controller.postMany)
router
    .route('/:id')
        .get(controller.getUnique)
        .patch(controller.editUnique)        
router
    .route('/:name')
        .delete(controller.deleteUnique)

export default router
