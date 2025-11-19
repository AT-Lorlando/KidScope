import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { signupValidator, loginValidator } from '#validators/auth_validator'

export default class AuthController {
  async signup({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const user = await User.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
      role: 'teacher', // For now only teachers can signup
    })
    await auth.use('web').login(user)
    return response.ok({ message: 'User created successfully', user })
  }

  async login({ request, auth, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)
    return response.ok({ message: 'Login successful', user })
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.ok({ message: 'Logout successful' })
  }

  async me({ auth, response }: HttpContext) {
    await auth.use('web').authenticate()
    const user = auth.getUserOrFail()
    return response.ok({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    })
  }
}
