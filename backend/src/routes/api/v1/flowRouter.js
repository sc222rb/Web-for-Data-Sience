/**
 * @file Defines the flow router.
 * @module routes/flowRouter
 * @author Sayaka Chishiki Jakobsson
 * @version 1.0.0
 */

import express from 'express'
import { FlowController } from '../../../controllers/api/FlowController.js'

export const router = express.Router({ mergeParams: true })

const controller = new FlowController()

// Map HTTP verbs and route paths to controller actions.
// Provide req.flow to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadDocument(req, res, next, id))

router.get('/',
  (req, res, next) => controller.getHourlyArrivalDepartureData(req, res, next)
)

router.get('/:id',
  (req, res, next) => controller.find(req, res, next)
)
