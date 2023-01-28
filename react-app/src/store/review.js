const CREATE_REVIEW = 'session/CREATE_REVIEW';
const GET_REVIEWS = 'session/GET_REVIEWS';
const DELETE_REVIEW = 'session/DELETE_REVIEW'
const EDIT_REVIEW = 'session/EDIT_REVIEW'

const createReview = (review) => ({
  type: CREATE_REVIEW,
  review
})

const fetchReviews = (reviews, userReviewed) => ({
  type: GET_REVIEWS,
  reviews,
  userReviewed
})

const deleteAReview = (id) => ({
  type: DELETE_REVIEW,
  id
})

const updateReview = (review) => ({
  type: EDIT_REVIEW,
  review
})

export const newReview = (payload) => async (dispatch) => {
  const response = await fetch("/api/reviews/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: payload.user_id,
      product_id: payload.product_id,
      rating: payload.rating,
      body: payload.body
    })
  });
  if (response.status >= 400) {
    throw response;
  }

  if (response.ok) {
    const createdReview = await response.json();
    dispatch(createReview(createdReview))

    return createReview;
  }
}


export const editForm = (payload) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${payload.review_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: payload.user_id,
      product_id: payload.product_id,
      rating: payload.rating,
      body: payload.body,
      review_id: payload.review_id
    })
  });
  if (response.status >= 400) {
    throw response;
  }
  if (response.ok) {
    const createdReview = await response.json();
    dispatch(updateReview(createdReview))
    return createReview;
  }
}


export const getReviews = (product_id, user_id) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${product_id}`, {
    method: "GET"
  })
  const data = await response.json()
  let haveuserleftreview = false

  data.reviews.forEach(review => {
    if (review.user_id === user_id) {
      haveuserleftreview = true
    }
  })
  dispatch(fetchReviews(data.reviews, haveuserleftreview))
}


export const deleteReview = (review_id) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${review_id}`, {
    method: "DELETE"
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(deleteAReview(review_id))
    return data
  }
}

export default function reviewsReducer(state = { all: {}, userReviewed: null }, action) {
  switch (action.type) {
    case GET_REVIEWS: {
      const reviews = { ...state }
      action.reviews.forEach(review => {
        reviews.all[review.id] = review;
      })
      return reviews;
    }
    case CREATE_REVIEW: {
      const reviews = { ...state };
      reviews.all[action.review.id] = action.review;
      return reviews;
    }
    case DELETE_REVIEW: {
      const reviews = { ...state }
      const id = action.id;
      delete reviews.all[id]
      reviews.userReviewed = true;
      return reviews;
    }
    case EDIT_REVIEW: {
      const reviews = { ...state };
      reviews.all[action.review.id] = action.review;
      return reviews;
    }
    default:
      return state
  }
}
