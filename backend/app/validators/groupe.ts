import vine from '@vinejs/vine'

export const createGroupeValidator = vine.compile(
  vine.object({
    nom: vine.string().minLength(1),
  })
)

export const updateGroupeValidator = vine.compile(
  vine.object({
    nom: vine.string().minLength(1).optional(),
  })
)

export const ajouterEleveValidator = vine.compile(
  vine.object({
    eleveId: vine.number(),
  })
)

export const retirerEleveValidator = vine.compile(
  vine.object({
    eleveId: vine.number(),
  })
)