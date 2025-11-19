import vine from '@vinejs/vine'

export const createEleveValidator = vine.compile(
  vine.object({
    nom: vine.string().minLength(1),
    prenom: vine.string().minLength(1),
    dateNaissance: vine.date(),
    niveau: vine.enum([
      'maternelle',
      'CP',
      'CE1',
      'CE2',
      'CM1',
      'CM2',
      '6e',
      '5e',
      '4e',
      '3e',
      '2nde',
      '1ère',
      'Terminale',
    ]),
  })
)

export const updateEleveValidator = vine.compile(
  vine.object({
    nom: vine.string().minLength(1).optional(),
    prenom: vine.string().minLength(1).optional(),
    dateNaissance: vine.date().optional(),
    niveau: vine
      .enum([
        'maternelle',
        'CP',
        'CE1',
        'CE2',
        'CM1',
        'CM2',
        '6e',
        '5e',
        '4e',
        '3e',
        '2nde',
        '1ère',
        'Terminale',
      ])
      .optional(),
  })
)