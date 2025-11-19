import vine from '@vinejs/vine'
import { EventTypes } from '../types.js'

export const createEventValidator = vine.compile(
  vine.object({
    type: vine.enum(EventTypes),
    title: vine.string().minLength(1),
    description: vine.string().optional(),
    date: vine.date(),
    report: vine.string().optional(),
  })
)

export const updateEventValidator = vine.compile(
  vine.object({
    type: vine.enum(EventTypes).optional(),
    title: vine.string().minLength(1).optional(),
    description: vine.string().optional(),
    date: vine.date().optional(),
    report: vine.string().optional(),
  })
)
