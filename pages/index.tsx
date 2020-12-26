import Layout from '../components/Layout'

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

  </Layout>
)

export default IndexPage
