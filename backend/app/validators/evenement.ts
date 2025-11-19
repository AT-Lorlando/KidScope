import vine from '@vinejs/vine'

export const createEvenementValidator = vine.compile(
  vine.object({
    type: vine.enum([
      'discipline',
      'convocation',
      'orientation',
      'rencontre_parent',
      'suivi_pedagogique',
    ]),
    titre: vine.string().minLength(1),
    description: vine.string().optional(),
    date: vine.date(),
    compteRendu: vine.string().optional(),
  })
)

export const updateEvenementValidator = vine.compile(
  vine.object({
    type: vine
      .enum([
        'discipline',
        'convocation',
        'orientation',
        'rencontre_parent',
        'suivi_pedagogique',
      ])
      .optional(),
    titre: vine.string().minLength(1).optional(),
    description: vine.string().optional(),
    date: vine.date().optional(),
    compteRendu: vine.string().optional(),
  })
)