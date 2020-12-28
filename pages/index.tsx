import Layout from '../components/Layout'
import { useState, useEffect, Dispatch, SetStateAction } from "react"

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

interface Monster {
  name: string;
  location: string;
  hobbies: string;
}

const MonsterForm = (props: {setMonsterData: Dispatch<SetStateAction<Monster[]>>}) => {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [hobbies, setHobbies] = useState("")

  const submitMonster = () => {
    fetch(`http://localhost:5000/add?name=${name}&location=${location}&hobbies=${hobbies}`)
    .then(res => res.json())
    .then((res) => {
      console.log(res)
      props.setMonsterData(res.monsterData)
    }, (err) => {
      console.log(err.message)
    })
  }

  return (
    <form>
      <label>Name:</label>
      <input onChange={(event) => setName(event.target.value)}></input>
      <label>Location:</label>
      <input onChange={(event) => setLocation(event.target.value)}></input>
      <label>Hobbies:</label>
      <input onChange={(event) => setHobbies(event.target.value)}></input>
      <button onClick={() => submitMonster()}>add</button>
    </form>
  )
}

const ServerDataTable = () => {
  const [isLoading, setLoading] = useState(true)
  const [monsterData, setMonsterData] = useState<Monster[]>([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/monsterData")
    .then(res => res.json())
    .then((res) => {
      console.log(res)
      setLoading(false)
      setMonsterData(res.monsterData)
    },
    (err) => {
      setLoading(false)
      setError(err.message)
    })
  }, [])

  const removeMonster = (monsterName: string) => {
    fetch("http://localhost:5000/remove/" + monsterName)
    .then(res => res.json())
    .then((res) => {
      setMonsterData(res.monsterData)
    }, (err) => {
      console.log(err.message)
    })
  }

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  } else if (error) {
    return (
      <p>{error}</p>
    )
  } else {
    return (
      <div>
      <h3>Monsters at the Mash</h3>
      <table>
        <thead>
        <tr>
          <th>name</th>
          <th>location</th>
          <th>hobbies</th>
        </tr>
        </thead>
        <tbody>
        {monsterData.map( (monster, i) => (
          <tr key={`${monster.name}-${i}`}>
            <td>{monster.name}</td>
            <td>{monster.location}</td>
            <td>{monster.hobbies}</td>
            <td>
              <button onClick={() => removeMonster(monster.name)}>Delete</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <MonsterForm setMonsterData={setMonsterData} />
      </div>
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
      <p>Great! Our basic API call went through. Now, let's try to import data for a table:</p>
      <ServerDataTable />
  </Layout>
)

export default IndexPage
