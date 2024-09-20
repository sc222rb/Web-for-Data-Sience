/**
 * @file Defines the hive router.
 * @module routes/hiveRouter
 * @author Sayaka Chishiki Jakobsson
 * @version 1.0.0
 */

import express from 'express'
import { HiveController } from '../../../controllers/api/HiveController.js'
import { router as flowRouter } from './flowRouter.js'

export const router = express.Router()

const controller = new HiveController()
// Map HTTP verbs and route paths to controller actions.

// Provide req.hive to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadDocument(req, res, next, id))

router.get('/',
  (req, res, next) => controller.findAll(req, res, next)
)

router.get('/:id',
  (req, res, next) => controller.find(req, res, next)
)

// Use the flow router for /hives/:id/flow routes
router.use('/:id/flow', flowRouter)
