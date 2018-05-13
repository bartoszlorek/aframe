function isRequest(value) {
    return value && typeof value.id === 'number'
}

export default isRequest
