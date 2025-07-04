import { put, takeEvery } from "redux-saga/effects";
import { CREATE_TESTIMONIAL, CREATE_TESTIMONIAL_RED, DELETE_TESTIMONIAL, DELETE_TESTIMONIAL_RED, GET_TESTIMONIAL, GET_TESTIMONIAL_RED, UPDATE_TESTIMONIAL, UPDATE_TESTIMONIAL_RED } from "../Constant";
// import { createRecord, deleteRecord, getRecord,  updateRecord } from "./Services/ApiCallingService";
import { createMultiPartRecord, deleteRecord, getRecord, updateMultiPartRecord } from "./Services/ApiCallingService";

function* createSaga(action) {
    // let response = yield createRecord("testimonial", action.payload)
    let response = yield createMultiPartRecord("testimonial", action.payload)
    yield put({ type: CREATE_TESTIMONIAL_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("testimonial")
    yield put({ type: GET_TESTIMONIAL_RED, payload: response.data })
}

function* updateSaga(action) {
    // yield updateRecord("testimonial", action.payload)
    // yield put({ type: UPDATE_TESTIMONIAL_RED, payload: action.payload })
    let response = yield updateMultiPartRecord("testimonial", action.payload)
    yield put({ type: UPDATE_TESTIMONIAL_RED, payload: response.data })
}
function* deleteSaga(action) {
    yield deleteRecord("testimonial", action.payload)
    yield put({ type: DELETE_TESTIMONIAL_RED, payload: action.payload })
}
export default function* testimonialSaga() {
    yield takeEvery(CREATE_TESTIMONIAL, createSaga)
    yield takeEvery(GET_TESTIMONIAL, getSaga)
    yield takeEvery(UPDATE_TESTIMONIAL, updateSaga)
    yield takeEvery(DELETE_TESTIMONIAL, deleteSaga)
}