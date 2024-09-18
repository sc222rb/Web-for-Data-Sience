import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  hiveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hive'
  },
  humidity: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

schema.add(BASE_SCHEMA)
schema.index({ hiveId: 1, timestamp: 1 })

// Create a model using the schema.
export const HumidityModel = mongoose.model('Humidity', schema)
