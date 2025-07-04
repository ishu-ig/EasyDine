import { put, takeEvery } from "redux-saga/effects";
import { CREATE_NEWSLETTER, CREATE_NEWSLETTER_RED, DELETE_NEWSLETTER, DELETE_NEWSLETTER_RED, GET_NEWSLETTER, GET_NEWSLETTER_RED, UPDATE_NEWSLETTER, UPDATE_NEWSLETTER_RED } from "../Constant";
import { createRecord, deleteRecord, getRecord,  updateRecord } from "./Services/ApiCallingService";
// import { createMultiPartRecord, deleteRecord, getRecord, updateMultiPartRecord } from "./Services/ApiCallingService";

function* createSaga(action) {
    let response = yield createRecord("newsletter", action.payload)
    // let response = yield createMultiPartRecord("newsletter", action.payload)
    yield put({ type: CREATE_NEWSLETTER_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("newsletter")
    yield put({ type: GET_NEWSLETTER_RED, payload: response.data })
}

function* updateSaga(action) {
    yield updateRecord("newsletter", action.payload)
    // yield updateMultiPartRecord("newsletter", action.payload)
    yield put({ type: UPDATE_NEWSLETTER_RED, payload: action.payload })
}
function* deleteSaga(action) {
    yield deleteRecord("newsletter", action.payload)
    yield put({ type: DELETE_NEWSLETTER_RED, payload: action.payload })
}
export default function* newsletterSaga() {
    yield takeEvery(CREATE_NEWSLETTER, createSaga)
    yield takeEvery(GET_NEWSLETTER, getSaga)
    yield takeEvery(UPDATE_NEWSLETTER, updateSaga)
    yield takeEvery(DELETE_NEWSLETTER, deleteSaga)
}