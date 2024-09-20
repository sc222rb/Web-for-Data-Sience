/**
 * @file Defines the weight router.
 * @module routes/weightRouter
 * @author Sayaka Chishiki Jakobsson
 * @version 1.0.0
 */

import express from 'express'
import { WeightController } from '../../../controllers/api/WeightController.js'

export const router = express.Router({ mergeParams: true })

const controller = new WeightController()

// Map HTTP verbs and route paths to controller actions.
// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadDocument(req, res, next, id))

router.get('/',
  (req, res, next) => controller.getAverageWeight(req, res, next)
)

router.get('/:id',
  (req, res, next) => controller.find(req, res, next)
)
