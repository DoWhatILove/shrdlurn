import io from "socket.io-client"
import Constants from "constants/actions"
import Strings from "constants/strings"

function sendSocket(getState, event, message) {
  let socket = getState().logger.socket

  return new Promise((resolve, reject) => {
    if (socket && socket.connected && typeof socket.emit === "function") {
      socket.emit(event, message)
      resolve(socket)
    } else {
      // Retry
      setTimeout(() => {
        socket = getState().logger.socket
        if (socket && socket.connected && typeof socket.emit === "function") {
          socket.emit(event, message)
          resolve(socket)
        } else {
          setTimeout(() => {
            socket = getState().logger.socket
            if (socket && socket.connected && typeof socket.emit === "function") {
              socket.emit(event, message)
              resolve(socket)
            } else {
              setTimeout(() => {
                socket = getState().logger.socket
                if (socket && socket.connected && typeof socket.emit === "function") {
                  socket.emit(event, message)
                  resolve(socket)
                } else {
                  console.log("send socket failed retry, error?")
                  reject("retry failed")
                }
              }, 3000)
            }
          }, 1000)
        }
      }, 500)
    }
  })
}

const Actions = {
  open: () => {
    return (dispatch, getState) => {
      const { sessionId } = getState().user

      const socket = io(Strings.LOGGER_URL)
      socket.on("connect", () => {
        console.log("logging socket connected")

        sendSocket(getState, "session", {"sessionId": sessionId})

        sendSocket(getState, "getscore", {})

        /* Query for a new score every 3 minutes */
        setInterval(() => sendSocket(getState, "getscore", {}), 180000)

        dispatch({
          type: Constants.OPEN_LOGGING_SOCKET,
          socket: socket
        })
      })

      socket.on("score", (e) => {
        dispatch({
          type: Constants.USER_SCORE,
          score: e.score
        })
      })
    }
  },

  log: (e) => {
    return (dispatch, getState) => {
      const payload = { type: e.type, msg: e.msg }

      sendSocket(getState, "log", payload)
    }
  },

  joinCommunity: (e) => {
    return (dispatch, getState) => {
      sendSocket(getState, "join", {"room": "community"})
        .then((socket) => {
          console.log("joined the community room")

          socket.on("new_accept", (e) => {
            dispatch({
              type: Constants.NEW_ACCEPT,
              uid: e.uid,
              query: e.query,
              timestamp: e.timestamp
            })
          })

          socket.on("new_define", (e) => {
            dispatch({
              type: Constants.NEW_DEFINE,
              uid: e.uid,
              defined: e.defined,
              timestamp: e.timestamp
            })
          })

          socket.on("upvote", (e) => {
            dispatch({
              type: Constants.NEW_UPVOTE,
              uid: e.uid,
              id: e.id,
              up: e.up,
              score: e.score
            })
          })

          socket.on("struct", (e) => {
            dispatch({
              type: Constants.NEW_STRUCT,
              uid: e.uid,
              id: e.id,
              score: e.score,
              upvotes: e.upvotes,
              struct: e.struct
            })
          })

          socket.on("utterances", (e) => {
            dispatch({
              type: Constants.NEW_UTTERANCES,
              uid: e.uid,
              utterances: e.utterances
            })
          })

          socket.on('top_builders', (e) => {
            dispatch({
              type: Constants.LOAD_TOP_BUILDERS,
              topBuilders: e.top_builders
            })
          })
        })
    }
  },

  share: () => {
    return (dispatch, getState) => {
      const { history } = getState().world
      const { lastValue } = getState().logger

      const structure = history[history.length - 1]

      if (structure.value.length < 10) {
        alert("You are sharing a really simple structure (less than 10 blocks total). Try creating something a bit more complex and interesting and then sharing that.")
        return
      }

      const value = JSON.stringify(structure.value)
      const recipe = history.map(h => h.text)

      if (value === lastValue) {
        alert("You've already shared this structure. Make a new structure, and share that!")
        return
      }

      const payload = { struct: { value, recipe } }

      sendSocket(getState, "share", payload)

      alert("Shared your structure! View it on the Community page.")

      dispatch({
        type: Constants.SHARED_STRUCT,
        value: value
      })
    }
  },

  upvote: (uid, id) => {
    return (dispatch, getState) => {
      const payload = { uid: uid, id: id }
      sendSocket(getState, "upvote", payload)
    }
  }
}

export default Actions