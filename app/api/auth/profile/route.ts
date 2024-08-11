import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/lib/models/UserModel'
import bcrypt from 'bcryptjs'

export const PUT = auth(async (req) => {
  if (!req.auth) {
    return new Response(JSON.stringify({ message: 'Not authenticated' }), { status: 401 })
  }

  const { user } = req.auth
  
  const { name, email, password } = await req.json()

  if (!user) {
   
    return new Response(JSON.stringify({ message: 'User not authenticated' }), { status: 401 })
  }

  await dbConnect()

  try {
    const dbUser = await UserModel.findById(user)
    console.log(dbUser)

    if (!dbUser) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 })
    }

    dbUser.name = name
    dbUser.email = email
    dbUser.password = password ? await bcrypt.hash(password, 5) : dbUser.password

    await dbUser.save()

    return new Response(JSON.stringify({ message: 'User has been updated' }))
  } catch (err: unknown) {
    console.error(err) // Log the error for debugging
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 })
  }
}) as any