/**
 * @file Defines the Flow Controller class.
 * @module FlowController
 * @author Sayaka Chishiki Jakobsson
 */

import { FlowModel } from '../../models/FlowModel.js'
import { loadDocument, buildMatchStage } from '../../utils/ControllerUtils.js'

/**
 * Encapsulates a controller.
 */
export class FlowController {
  /**
   * Loads a flow document and attaches it to the request object.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The ID of the flow document to load.
   * @returns {Promise<void>} - Promise that resolves when the hive document is loaded and attached to the request object.
   */
  async loadDocument (req, res, next, id) {
    return loadDocument(FlowModel, req, res, next, id)
  }

  /**
   * Sends a JSON response containing flow of a hive.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async find (req, res, next) {
    res.json(req.doc)
  }

  /**
   * Sends a JSON response containing flow of alla hives.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const flows = await FlowModel.find()

      res.json(flows)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Retrieves arrival and departure data for a hive within a specified time range.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async getHourlyArrivalDepartureData (req, res, next) {
    try {
      const { id } = req.params
      const { from, to } = req.query

      const matchStage = buildMatchStage(id, from, to)

      // Define the aggregation pipeline
      const aggregationPipeline = [
        matchStage,
        {
          $addFields: {
            hour: {
              $dateToString: { format: '%Y-%m-%dT%H:00:00', date: '$timestamp' }
            }
          }
        },
        {
          $group: {
            _id: '$hour',
            avgArrivals: {
              $avg: {
                $cond: [{ $gt: ['$flow', 0] }, '$flow', null]
              }
            },
            avgDepartures: {
              $avg: {
                $cond: [{ $lt: ['$flow', 0] }, '$flow', null]
              }
            },
            avgNetFlow: {
              $avg: '$flow'
            }
          }
        },
        {
          $sort: { _id: 1 } // Sort by hour in ascending order
        },
        {
          $project: {
            _id: 0, // Exclude _id from the result
            hour: '$_id',
            avgArrivals: 1,
            avgDepartures: 1,
            avgNetFlow: 1
          }
        }
      ]

      // Execute the aggregation pipeline
      const data = await FlowModel.aggregate(aggregationPipeline)

      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No flow data found for the specified hive and time range' })
      }

      res.json(data)
    } catch (error) {
      next(error)
    }
  }
}
