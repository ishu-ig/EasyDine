import { put, takeEvery } from "redux-saga/effects";
import { CREATE_PRODUCT, CREATE_PRODUCT_RED, DELETE_PRODUCT, DELETE_PRODUCT_RED, GET_PRODUCT, GET_PRODUCT_RED, UPDATE_PRODUCT, UPDATE_PRODUCT_RED } from "../Constant";
// import { createRecord, deleteRecord, getRecord,  updateRecord } from "./Services/ApiCallingService";
import { createMultiPartRecord, deleteRecord, getRecord, updateMultiPartRecord } from "./Services/ApiCallingService";

function* createSaga(action) {
    // let response = yield createRecord("product", action.payload)
    let response = yield createMultiPartRecord("product", action.payload)
    yield put({ type: CREATE_PRODUCT_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("product")
    yield put({ type: GET_PRODUCT_RED, payload: response.data })
}

function* updateSaga(action) {
    // yield updateRecord("product", action.payload)
    // yield put({ type: UPDATE_PRODUCT_RED, payload: action.payload })
    let response = yield updateMultiPartRecord("product", action.payload)
    yield put({ type: UPDATE_PRODUCT_RED, payload: response.data })
}
function* deleteSaga(action) {
    yield deleteRecord("product", action.payload)
    yield put({ type: DELETE_PRODUCT_RED, payload: action.payload })
}
export default function* productSaga() {
    yield takeEvery(CREATE_PRODUCT, createSaga)
    yield takeEvery(GET_PRODUCT, getSaga)
    yield takeEvery(UPDATE_PRODUCT, updateSaga)
    yield takeEvery(DELETE_PRODUCT, deleteSaga)
}