import { rootReducer } from './combine'
import { createStore ,applyMiddleware } from 'redux'
import thunk from 'redux-thunk' 
import isPromise from 'is-promise'
import axios from '../axios.js'
import {setBigMovies} from '../features/moviesSlice.js'
import { getUser } from '../utils/HomePage.fns'

function logger ({getState}) {
    return next => action => {
        console.log('action : ' , action)
        next(action) 
        console.log('state :  ', getState())
    }
}

function getMovies({getState}) {
    return (next) => async (action)  => {
        let movies = []
        if(action.type === "UPDATED_SLIDER_MOVIES") {
            async function exchange() {
                action.payload.map(movie => {
                    axios.get(`/titles/${movie.movie_name}`)
                    .then(res => {
                        movies.push({movie_data : res.data , percent : movie.match_percent})
                    })
                })
            }
            exchange()     
            action.payload = movies
        }
        return next(action)
    }
}

function changeUser({getState}) {
    return next => action => {
        async function change() {
            await getUser()
        }
        if(action.type === "UPDATED_CURRENT_MOVIE") {
            change()
        }
        return next(action)
    }
}

const middleware = applyMiddleware(changeUser)
const store = createStore(rootReducer,middleware)
export default store


