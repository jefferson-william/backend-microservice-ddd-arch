import crypto from 'node:crypto'

export class User {
  constructor(
    private data: {
      id: number
      email: string
      password: string
      firstName: string
      lastName: string
      uuid?: string
      middleName?: string
    },
    uuid: string | null,
  ) {
    if (!uuid) {
      this.data.uuid = crypto.randomUUID()
    } else {
      this.data.uuid = uuid
    }
  }

  get uuid() {
    return this.data.uuid as string
  }

  get id() {
    return this.data.id
  }

  get email() {
    return this.data.email
  }

  get password() {
    return this.data.password
  }

  get firstName() {
    return this.data.firstName
  }

  get lastName() {
    return this.data.lastName
  }

  get middleName() {
    return this.data.middleName
  }

  getFullName() {
    const fullName = [this.data.firstName]
    if (this.data.middleName) fullName.push(this.data.middleName)
    fullName.push(this.data.lastName)
    return fullName.join(' ')
  }

  toJSON() {
    return this.data
  }
}
