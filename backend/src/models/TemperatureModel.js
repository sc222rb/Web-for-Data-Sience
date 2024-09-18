import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  hiveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hive'
  },
  temperature: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sensorId: {
    type: Number
  }
})

schema.add(BASE_SCHEMA)
schema.index({ hiveId: 1, timestamp: 1 })

// Create a model using the schema.
export const TemperatureModel = mongoose.model('Temperature', schema)
