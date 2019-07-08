import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";
import { toastr } from "react-redux-toastr";
import { createNewEvent } from "../../app/common/util/helpers";
import firebase from "../../app/config/firebase";
import { FETCH_EVENTS } from "./eventConstants";

export const createEvent = event => {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const user = firebase.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    const newEvent = createNewEvent(user, photoURL, event);
    try {
      // get doc snapshot after create event
      let createdEvent = await firestore.add("events", newEvent);
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true
      });
      toastr.success("Success!", "Event has been created");
      return createdEvent;
    } catch (error) {
      toastr.error("Oops", "Something went wrong");
    }
  };
};

export const cancelToggle = (cancelled, eventId) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const message = cancelled
    ? "Are you sure you want to cancel the event?"
    : "This will reactivate the event, are you sure?";
  try {
    toastr.confirm(message, {
      onOk: async () =>
        await firestore.update(`events/${eventId}`, {
          cancelled: cancelled
        })
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateEvent = event => {
  return async (dispatch, getState) => {
    const firestore = firebase.firestore();
    try {
      dispatch(asyncActionStart());
      let eventDocRef = firestore.collection("events").doc(event.id);
      let dateEqual = getState().firestore.ordered.events[0].date.isEqual(event.date);
      if (!dateEqual) {
        let batch = firestore.batch();
        batch.update(eventDocRef, event);

        let eventAttendeeRef = firestore.collection("event_attendee");
        let eventAttendeeQuery = await eventAttendeeRef.where("eventId", "==", event.id);
        let eventAttendeeQuerySnap = await eventAttendeeQuery.get();

        for (let i = 0; i < eventAttendeeQuerySnap.docs.length; i++) {
          let eventAttendeeDocRef = firestore
            .collection("event_attendee")
            .doc(eventAttendeeQuerySnap.docs[i].id);

          batch.update(eventAttendeeDocRef, {
            eventDate: event.date
          });
        }
        await batch.commit();
      } else {
        await eventDocRef.update(event);
      }
      dispatch(asyncActionFinish());
      toastr.success("Success!", "Event has been updated");
    } catch (error) {
      dispatch(asyncActionError());
      toastr.error("Oops", "Something went wrong");
    }
  };
}

export const addEventComment = (eventId, values, parentId) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const profile = getState().firebase.profile;
  const user = firebase.auth().currentUser;
  let newComment = {
    parentId: parentId,
    displayName: profile.displayName,
    photoURL: profile.photoURL || "/assets/user.png",
    uid: user.uid,
    text: values.comment,
    date: Date.now()
  };
  try {
    await firebase.push(`event_chat/${eventId}`, newComment);
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Problem adding comment");
  }
};

export const getEventsForDashboard = lastEvent => async (
  dispatch,
  getState
) => {
  const today = new Date();
  const firestore = firebase.firestore();
  const eventsRef = firestore.collection("events");
  try {
    dispatch(asyncActionStart());
    let startAfter = lastEvent &&
      (await firestore
        .collection("events")
        .doc(lastEvent.id)
        .get());
    let query;

    lastEvent
      ? (query = eventsRef
        .where("date", ">=", today)
        .orderBy("date")
        .startAfter(startAfter)
        .limit(2))
      : (query = eventsRef
        .where("date", ">=", today)
        .orderBy("date")
        .limit(2));
    let querySnap = await query.get();
    // retrun querySnap if docs not exists
    if (querySnap.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnap;
    }
    let events = [];
    // loop throght docs
    for (let i = 0; i < querySnap.docs.length; i++) {
      // extract document and add an id
      let evt = {
        ...querySnap.docs[i].data(),
        id: querySnap.docs[i].id
      };
      events.push(evt);
    }
    dispatch(asyncActionFinish());
    dispatch({ type: FETCH_EVENTS, payload: { events } });
    return querySnap;
  } catch (error) {
    dispatch(asyncActionError());
    console.log(error);
  }
};