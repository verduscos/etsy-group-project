import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import * as sessionActions from "../../store/review"
import "./Reviews.css"

// import { BsStarFill, BsCart4 } from "react-icons/bs"

let stars;
const displayRating = (num) => {
    let whole = parseInt(num) / 2;
    let half = num % 2;

    stars = (
        <div className={`stars-${whole}`}></div>
    )
        return stars
}

// console.log(displayRating(10), 'HEREHERHEHERE')
// console.log(displayRating(5), 'HEREHERHEHERE')

const GetReviews = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.session.user);
    // TODO - fix state in order to not have to do review.reviews (normalize?)
    const reviews = useSelector(state => state.review.reviews);
    const [test, setTest] = useState(false)


    const [deleteId, setDeleteId] = useState(0)

    let { productId } = useParams()


    const handleDelete = (e, id) => {
       e.preventDefault();

       const res = dispatch(sessionActions.deleteReview(id))
       setTest(!test)
       if (res.id) return 'asdflasjfasdkl'
    }

    let deleteBtn;
    deleteBtn = (
        <button onClick={handleDelete}>Delete</button>
    )

    useEffect(() => {
        dispatch(sessionActions.getReviews(productId))

    }, [dispatch, test])

    useEffect(() => {
        dispatch(sessionActions.getReviews(productId))

    }, [dispatch, test])

    return (
        // TODO - clean up code, get rid of warnings if possible
        <>
        <h1>REVIEWS</h1>
        <ul>
            {reviews?.reviews?.map(review => (
                <div id="review-container">
                    <div id="review-row1">
                        <img className="profile-pic review-pic" src={review.profile_picture_url} />
                        <li id="review-author">{review.username}</li>
                        <li id="review-date">{review.updated_at}</li>
                    </div>

                    {/* TODO - start rating system */}

                    <div id="review-row2">
                        {/* <div className="stars-1"></div> */}

                        <span className={`stars stars-${review.rating}`}></span>


                        <li>{review.body}</li>
                    </div>
                    {/* Only display deleteBtn for a review by currentUser */}

                    { review.user_id == currentUser.id ?
                     <button  className="btn" id="deleteReviewBtn" onClick={(e) => {
                         setDeleteId(review.id)
                        handleDelete(e, review.id)
                     }} value={review.id}>Delete</button>
                     : null }
                </div>
            ))}
        </ul>
        </>
    )
}


export default GetReviews
