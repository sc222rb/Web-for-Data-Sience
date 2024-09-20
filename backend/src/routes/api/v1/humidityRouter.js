/**
 * @file Defines the humidity router.
 * @module routes/humidityRouter
 * @author Sayaka Chishiki Jakobsson
 * @version 1.0.0
 */

import express from 'express'
import { HumidityController } from '../../../controllers/api/HumidityController.js'

export const router = express.Router({ mergeParams: true })

const controller = new HumidityController()

// Map HTTP verbs and route paths to controller actions.
// Provide req.humidity to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadDocument(req, res, next, id))

router.get('/',
  (req, res, next) => controller.getHumidity(req, res, next)
)

router.get('/:id',
  (req, res, next) => controller.find(req, res, next)
)
