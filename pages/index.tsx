import Layout from '../components/Layout'
import { useState, useEffect } from "react"

const ServerCall = () => {
  const [isLoading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  useEffect(() => {
    fetch("http://localhost:5000/hellonode")
    .then(res => res.json())
    .then((res) => {
      console.log(res)
      setLoading(false)
      setMessage(res.text)
    },
    (err) => {
      setLoading(false)
      setMessage(`${err}`)
    })
  }, [])

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  } else {
    return (
      <p>{message}</p>
    )
  }
}

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Full-Stack React 👋</h1>
    <p>
      Let's practice connecting React to a backend! In this simple project, we'll build the following:
    </p>
    <ol>
      {[
        "Set up react client with async call to server",
        "Set up server with Mock DB / API response to client",
        "Add CRUD calls to server from client",
        "Refactor Mock DB to use Mongo/ Mongoose",
        "Integrate GraphQL/ Apollo",
        "Set up user login/ auth",
        "Manage Cookies/ session ID"
      ].map((task, i) => (<li key={`task-${i}`}>{task}</li>))}
    </ol>
    <p>Let's try connecting to the server:</p>
    <ServerCall />

  </Layout>
)

export default IndexPage
