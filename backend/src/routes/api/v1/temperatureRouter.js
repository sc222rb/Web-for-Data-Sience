/**
 * @file Defines the temperature router.
 * @module routes/temperatureRouter
 * @author Sayaka Chishiki Jakobsson
 * @version 1.0.0
 */

import express from 'express'
import { TemperatureController } from '../../../controllers/api/TemperatureController.js'

export const router = express.Router({ mergeParams: true })

const controller = new TemperatureController()

// Map HTTP verbs and route paths to controller actions.
// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadDocument(req, res, next, id))

router.post('/',
  (req, res, next) => controller.create(req, res, next)
)

router.get('/',
  (req, res, next) => controller.getAverageTemperature(req, res, next)
)

router.get('/:id',
  (req, res, next) => controller.find(req, res, next)
)
