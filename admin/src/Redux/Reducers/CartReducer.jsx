import { CREATE_CART_RED, DELETE_CART_RED, GET_CART_RED, UPDATE_CART_RED } from "../Constant";

export default function CartReducer(state=[], action) {
    switch (action.type) {
        case CREATE_CART_RED:
            let newstate = [...state]
            newstate.push(action.payload)
            return newstate

        case GET_CART_RED:
            return action.payload

        case UPDATE_CART_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].qty = action.payload.qty
            state[index].total = action.payload.total
            return state

        case DELETE_CART_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}
