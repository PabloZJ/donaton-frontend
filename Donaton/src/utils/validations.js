export const validators = {
    email: (value) => {
        if (!value?.trim()) return 'El correo electrónico es obligatorio'
        const v = value.trim()

        if (v.length > 254) return 'El correo es demasiado largo'
        if (v.includes('..')) return 'El correo no puede tener puntos consecutivos'

        const match = /^([^\s@]+)@([^\s@]+)$/.exec(v)
        if (!match) return 'Ingresa un correo válido'
        const [, local, domain] = match

        if (local.length > 64) return 'La parte antes del @ es demasiado larga'
        if (/^\.|\.$/.test(local)) return 'El correo no puede empezar o terminar con punto'
        if (!/^[a-zA-Z0-9._%+-]+$/.test(local)) return 'El correo contiene caracteres no permitidos'

        const domainParts = domain.split('.')
        const validDomain =
        domainParts.length >= 2 &&
        domainParts.every((part) => /^[a-zA-Z0-9-]{1,63}$/.test(part) && !part.startsWith('-') && !part.endsWith('-')) &&
        /^[a-zA-Z]{2,24}$/.test(domainParts[domainParts.length - 1])

        if (!validDomain) return 'Ingresa un correo válido'

        return null
    },

    password: (value) => {
        if (!value) return 'La contraseña es obligatoria'
        if (value.trim().length === 0) return 'La contraseña no puede contener solo espacios'
        if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
        if (value.length > 72) return 'La contraseña es demasiado larga'
        if (/\s/.test(value)) return 'La contraseña no puede contener espacios'
        return null
    },

    required: (value, label = 'Este campo') => {
        if (value === null || value === undefined) return `${label} es obligatorio`
        if (typeof value === 'string' && !value.trim()) return `${label} es obligatorio`
        if (Array.isArray(value) && value.length === 0) return `${label} es obligatorio`
        return null
    },

    quantity: (value, { min = 1, max = Infinity, label = 'La cantidad', integer = true } = {}) => {
        if (value === '' || value === null || value === undefined)
        return `${label} es obligatoria`
        if (typeof value === 'string' && !/^-?\d+(\.\d+)?$/.test(value.trim()))
        return `${label} debe ser un número`
        const num = Number(value)
        if (isNaN(num))
        return `${label} debe ser un número`
        if (integer && !Number.isInteger(num))
        return `${label} debe ser un número entero`
        if (!Number.isFinite(num) || Math.abs(num) > Number.MAX_SAFE_INTEGER)
        return `${label} está fuera de rango`
        if (num < min) return `${label} debe ser al menos ${min}`
        if (num > max) return `${label} no puede superar ${max}`
        return null
    },

    minLength: (value, { min, label = 'Este campo', trim = true } = {}) => {
        const v = trim && typeof value === 'string' ? value.trim() : value
        if (!v || v.length < min) return `${label} debe tener al menos ${min} caracteres`
        return null
    },

    maxLength: (value, { max, label = 'Este campo', trim = true } = {}) => {
        const v = trim && typeof value === 'string' ? value.trim() : value
        if (v && v.length > max) return `${label} no puede tener más de ${max} caracteres`
        return null
    },

    phone: (value) => {
        if (!value?.trim()) return 'El teléfono es obligatorio'
        const cleaned = value.replace(/[\s()-]/g, '')
        if (!/^\+?\d+$/.test(cleaned)) return 'El teléfono solo puede contener números, espacios y guiones'
        const digits = cleaned.replace(/^\+/, '')
        if (digits.length < 8 || digits.length > 15) return 'El teléfono debe tener entre 8 y 15 dígitos'
        return null
    },

    date: (value, { min, max, label = 'La fecha' } = {}) => {
        if (!value) return `${label} es obligatoria`
        const date = new Date(value)
        if (isNaN(date.getTime())) return `${label} no es válida`
        if (min && date < new Date(min)) return `${label} no puede ser anterior a ${min}`
        if (max && date > new Date(max)) return `${label} no puede ser posterior a ${max}`
        return null
    },

    select: (value, label = 'Esta opción') => {
        if (value === null || value === undefined || value === '') return `Debes seleccionar ${label}`
        return null
    },

    uid: (value) => {
        if (!value?.trim()) return 'El UID es obligatorio'
        const v = value.trim()
        if (/\s/.test(v)) return 'El UID no puede contener espacios'
        if (v.length < 10 || v.length > 128) return 'UID inválido'
        if (!/^[a-zA-Z0-9_-]+$/.test(v)) return 'El UID contiene caracteres no permitidos'
        return null
    },

    coordinate: (value, { label = 'La coordenada', type } = {}) => {
        const num = Number(value)
        if (value === '' || value === null || value === undefined)
        return `${label} es obligatoria`
        if (isNaN(num)) return `${label} debe ser un número`
        const range = type === 'lat' ? 90 : 180
        if (num < -range || num > range) return `${label} está fuera de rango`
        return null
    },
    }

export const withQuantity = (opts = {}) => (v) => validators.quantity(v, opts)
export const withRequired = (label) => (v) => validators.required(v, label)
export const withMinLength = (min, label) => (v) => validators.minLength(v, { min, label })
export const withMaxLength = (max, label) => (v) => validators.maxLength(v, { max, label })
export const withDate = (opts = {}) => (v) => validators.date(v, opts)
export const withSelect = (label) => (v) => validators.select(v, label)

    export const compose = (...validators) => (value) => {
    for (const validator of validators) {
        const error = validator(value)
        if (error) return error
    }
    return null
    }

    export const validateForm = (form, schema) => {
    const errors = {}
    for (const [field, validator] of Object.entries(schema)) {
        const error = validator(form[field], form)
        if (error) errors[field] = error
    }
    return { errors, isValid: Object.keys(errors).length === 0 }
    }

export const validateField = (value, validator, form) => validator(value, form)