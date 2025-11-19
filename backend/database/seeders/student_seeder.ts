import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Student from '#models/student'
import { DateTime } from 'luxon'
import { StudentLevels } from '../../app/types.js'

export default class extends BaseSeeder {
  async run() {
    const firstNames = [
      'Lucas', 'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia', 'Ethan', 'Isabella',
      'Mason', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Jacob', 'Harper',
      'Michael', 'Evelyn', 'Daniel', 'Abigail', 'Matthew', 'Emily', 'Aiden', 'Elizabeth',
      'Henry', 'Sofia', 'Joseph', 'Avery', 'Jackson', 'Ella', 'Samuel', 'Scarlett',
      'Sebastian', 'Grace', 'David', 'Chloe', 'Carter', 'Victoria', 'Wyatt', 'Riley',
      'Julien', 'Marie', 'Thomas', 'Camille', 'Antoine', 'Julie', 'Nicolas', 'Sarah',
      'Pierre', 'Laura', 'Alexandre', 'Manon', 'Maxime', 'Clara', 'Romain', 'Léa',
      'Paul', 'Emma', 'Hugo', 'Inès', 'Louis', 'Chloé', 'Arthur', 'Lola'
    ]

    const lastNames = [
      'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand',
      'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David',
      'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'André', 'Lefevre',
      'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez', 'Legrand', 'Garnier',
      'Faure', 'Rousseau', 'Blanc', 'Guerin', 'Muller', 'Henry', 'Roussel', 'Nicolas',
      'Perrin', 'Morin', 'Mathieu', 'Clement', 'Gauthier', 'Dumont', 'Lopez', 'Fontaine',
      'Chevalier', 'Robin', 'Masson', 'Sanchez', 'Gerard', 'Nguyen', 'Boyer', 'Denis'
    ]

    const students = []

    for (let i = 0; i < 100; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const level = StudentLevels[Math.floor(Math.random() * StudentLevels.length)]
      
      // Generate a random birthdate between 5 and 18 years ago
      const minAge = 5
      const maxAge = 18
      const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge
      const birthYear = DateTime.now().year - age
      const birthMonth = Math.floor(Math.random() * 12) + 1
      const birthDay = Math.floor(Math.random() * 28) + 1
      const birthdate = DateTime.fromObject({ year: birthYear, month: birthMonth, day: birthDay })

      students.push({
        lastName: lastName,
        firstName: firstName,
        birthdate: birthdate,
        level: level,
      })
    }

    await Student.createMany(students)
  }
}
