// Logger for debugging

export const logger = (state, action) => {
    console.group('Action Type', action.type)
    console.log('Action', action.payload)
    console.log('Old State', state)
    console.groupEnd()
}