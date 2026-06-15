export const validators = {
    email: (value) => {
        if (!value?.trim()) return 'El correo electrónico es obligatorio'
        if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value)) return 'Ingresa un correo válido'
        return null
    },

    password: (value) => {
        if (!value) return 'La contraseña es obligatoria'
        if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
        return null
    },

    required: (value, label = 'Este campo') => {
        if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
        return `${label} es obligatorio`
        }
        return null
    },

    quantity: (value, { min = 1, max = Infinity, label = 'La cantidad', integer = true } = {}) => {
        const num = Number(value)
        if (value === '' || value === null || value === undefined)
        return `${label} es obligatoria`
        if (isNaN(num))
        return `${label} debe ser un número`
        if (integer && !Number.isInteger(num))
        return `${label} debe ser un número entero`
        if (num < min) return `${label} debe ser al menos ${min}`
        if (num > max) return `${label} no puede superar ${max}`
        return null
    },

    minLength: (value, { min, label = 'Este campo' } = {}) => {
        if (!value || value.length < min) return `${label} debe tener al menos ${min} caracteres`
        return null
    },

    maxLength: (value, { max, label = 'Este campo' } = {}) => {
        if (value && value.length > max) return `${label} no puede tener más de ${max} caracteres`
        return null
    },

    phone: (value) => {
        if (!value?.trim()) return 'El teléfono es obligatorio'
        if (!/^\+?[\d\s-]{8,}$/.test(value.replace(/\s/g, ''))) return 'Ingresa un teléfono válido'
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
        if (value.length < 10) return 'UID inválido'
        return null
    },

    coordinate: (value, label = 'La coordenada') => {
        const num = Number(value)
        if (value === '' || value === null || value === undefined)
        return `${label} es obligatoria`
        if (isNaN(num)) return `${label} debe ser un número`
        if (num < -180 || num > 180) return `${label} está fuera de rango`
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